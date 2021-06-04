//import { Content, SheetContent, FolderContent, RootFolderContent } from 'Content.js'
//import { Filesystem, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';

import { Platform } from 'quasar';
import { Version } from '../App';
import { SheetContent } from './Content';
const { ipcRenderer } = require('electron');
const UserPrefs = require('src/js/UserPrefs.js');

//Node.js (Escritorio)
var path = require('path');
var fs = require('fs-extra');

var rootPath = UserPrefs.get('kMainFolderLocation'); //Path verdadero hasta la carpeta root
var mediaPath = UserPrefs.get('kMediaFolderLocation');
var currentPath = UserPrefs.TemporalStorage.getItem('sRealPath'); //Path verdadero completo
var userPath = UserPrefs.TemporalStorage.getItem('sPath'); //Path falso DESDE la carpeta root
var currentContent = {};

if (UserPrefs.get('kMainFolderLocation') != '' || undefined) {
  setRootPath(UserPrefs.get('kMainFolderLocation'));
}

if (UserPrefs.get('kMediaFolderLocation') != '' || undefined) {
  setMediaPath(UserPrefs.get('kMediaFolderLocation'));
}

export function normalize(path) {
  return path.normalize(path);
}

export function getRootPath() {
  return rootPath;
}

export function getMediaPath() {
  return mediaPath;
}

export function setCurrentPath(newCurrentPath) {
  currentPath = newCurrentPath;
  userPath = currentPath.replace(rootPath, '');
  UserPrefs.TemporalStorage.set('sPath', userPath);
  UserPrefs.TemporalStorage.set('sRealPath', currentPath);
}

export function downCurrentPath(newFolder) {
  currentPath = path.normalize(this.currentPath + `/${newFolder}`);
  userPath = currentPath.replace(rootPath, '');
  UserPrefs.TemporalStorage.set('sPath', userPath);
  UserPrefs.TemporalStorage.set('sRealPath', currentPath);
}

export function upCurrentPath() {
  currentPath = path.normalize(this.currentPath + '/..');
  userPath = currentPath.replace(rootPath, '');
  UserPrefs.TemporalStorage.set('sPath', userPath);
  UserPrefs.TemporalStorage.set('sRealPath', currentPath);
}

export function getCurrentPath() {
  return currentPath;
}

export function setUserPath(newUserPath) {
  userPath = newUserPath;
  UserPrefs.TemporalStorage.set('sRealPath', currentPath);
}

export function updateUserPath() {
  let newUserPath = this.currentPath.replace(this.rootPath, '');
  userPath = newUserPath;
  UserPrefs.TemporalStorage.set('sRealPath', currentPath);
}

export function getUserPath() {
  return userPath;
}

export function setRootPath(newRootPath) {
  rootPath = newRootPath;
}

export function setMediaPath(newMediaPath) {
  rootPath = newMediaPath;
}

export function loadFile(filePath) {
  return new Promise(async (resolve, reject) => {
    await fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        reject('FM: Error en lectura de fichero');
      } else {
        console.log('FM: Archivo leido satisfactoriamente');
        resolve(data);
      }
    });
  });
}

export function writeFile(filePath, data) {
  fs.writeFile(filePath, data, { encoding: 'utf8' }, err => {
    if (err) console.log(err);
    else {
      console.log('FM: Archivo escrito satisfactoriamente');
    }
  });
}

export async function renameContent(filepath, futurefilepath) {
  return new Promise(async (resolve, reject) => {
    await fs.rename(filepath, futurefilepath, err => {
      if (err) {
        console.log(err);
        reject('FM: Error en el renombrado');
      } else {
        console.log('FM: Renombrado satisfactorio\n');
        resolve();
      }
    });
  });
}

export async function renameJSON(filepath, futurefilepath) {
  try {
    let content = await JSON.parse(await loadFile(filepath));
    content.name = await path.parse(futurefilepath).name;
    await writeFile(futurefilepath, JSON.stringify(content));
    await removeContent(filepath);
  } catch (e) {
    console.log(e);
  }
}

export async function renameFolder(filepath, futurefilepath) {
  await renameContent(filepath, futurefilepath);
  await renameJSON(filepath + '.json', futurefilepath + '.json');
}

export async function renameSheet(filepath, futurefilepath) {
  await renameContent(filepath + '.md', futurefilepath + '.md');
  await renameJSON(filepath + '.json', futurefilepath + '.json');
}

export async function getValidContent(filepath, type = 'all') {
  var content = await getFolderContent(filepath);
  var validContent = [];
  //Filtrado rápido
  switch (type) {
    case 'folders':
      //Json de las carpetas
      validContent.push(
        content.filter((a = '') => {
          if (path.parse(a).ext == '.json') {
            if (content.includes(path.parse(a).name)) {
              return a;
            }
          }
        })
      );
      break;
    case 'sheets':
      //Json de Archivos
      validContent.push(
        content.filter((a = '') => {
          if (path.parse(a).ext == '.json') {
            if (content.includes(path.parse(a).name + '.md')) {
              return a;
            }
          }
        })
      );
      break;
    default:
      if (path.parse(a).ext == '.md' || '.json' || '') {
        if (validContent.length == 0) {
          validContent = [a];
        } else {
          validContent.push(a);
        }
      }
      break;
  }
  //Eliminación de archivos del sistema ("media" y "mythickeeper.dat")
  let a = validContent.indexOf('media');
  if (a > -1) {
    validContent.splice(a, 1);
  }
  let b = validContent.indexOf('mythickeeper.dat');
  if (b > -1) {
    validContent.splice(b, 1);
  }
  return validContent;
}

export async function getValidFolders(filepath) {
  return await getValidContent(filepath, 'folders');
}

export async function getValidSheets(filepath) {
  return await getValidContent(filepath, 'sheets');
}

export async function removeContent(filepath) {
  return new Promise(async (resolve, reject) => {
    await fs.rmdir(filepath, { recursive: true }, err => {
      if (err) {
        console.log(err);
        reject('FM: Error en el borrado');
      } else {
        console.log('FM: Borrado satisfactorio\n');
        resolve();
      }
    });
  });
}

export async function removeFolder(filepath) {
  await removeContent(filepath);
  await removeContent(filepath + '.json');
}

export async function removeSheet(filepath) {
  await removeContent(filepath + '.md');
  await removeContent(filepath + '.json');
}

export function createSheet(filepath) {
  fs.writeFileSync(filepath + '.md', '');
}

export function copy(origin, destination) {
  fs.copy(origin, destination, function(err) {
    if (err) {
      console.log('FM: Ha ocurrido un error importando');
      return console.error(err);
    }
    console.log('FM: ¡Importación completada!');
  });
}

export function copyFolder(origin, destination) {
  copy(origin, destination);
  if (fs.existsSync(origin + '.json')) {
    copy(origin + '.json', destination);
  } else {
    let foldername = path.parse(origin).name;
    let foldercontent = new SheetContent(
      foldername,
      'Folder',
      {},
      destination,
      'folder',
      false,
      '#c62219'
    );
    writeFile(destination, JSON.stringify(foldercontent));
  }
}

export function copyMarkdown(origin, destination) {
  let extension = path.parse(origin).ext;
  let aorigin = origin.replace(extension, '');
  copy(origin, destination);
  if (fs.existsSync(aorigin + '.json')) {
    copy(aorigin + '.json', destination);
  } else {
    let filename = path.parse(origin).name;
    let sheetcontent = new SheetContent(
      filename,
      'Sheet',
      {},
      destination,
      'insert_drive_file',
      false,
      '#c62219'
    );
    writeFile(destination, JSON.stringify(sheetcontent));
  }
}

/*
- Operaciones con carpetas
*/

export function createFolder(filepath) {
  fs.mkdirSync(filepath);
}

export function createRootFolder(filepath) {
  let newMediaPath = filepath + '/media';
  createFolder(newMediaPath);
  writeFile(filepath + '/mythickeeper.dat', Version);
  setRootFolder(filepath);
}

export function setRootFolder(filepath) {
  let newMediaPath = filepath + '/media';
  UserPrefs.set('kMainFolderLocation', filepath);
  UserPrefs.set('kMediaFolderLocation', newMediaPath);
  rootPath = filepath;
  mediaPath = newMediaPath;
  currentPath = filepath;
}

export async function checkIfRootFolder(filepath) {
  let valid = false;
  let supposedMediaPath = filepath + '/media';
  let supposedDatPath = filepath + '/mythickeeper.dat';
  if (fs.existsSync(supposedMediaPath) && fs.existsSync(supposedDatPath)) {
    if ((await loadFile(supposedDatPath)) == Version) {
      valid = true;
    } else {
      //Si no es la misma versión
      await ipcRenderer.sendSync(
        'showSelectEmptyOnlyMSG',
        'No es una versión válida. Abortando'
      );
    }
  } else {
    //Si no existe media o el .dat
    await ipcRenderer.sendSync(
      'showSelectEmptyOnlyMSG',
      'No es una carpeta válida. Abortando.'
    );
  }
  return valid;
}

export function checkIfEmpty(filePath) {
  //Poner await en uso
  return new Promise(async (resolve, reject) => {
    await fs.readdir(filePath, (err, files) => {
      let valid = true;
      if (err) {
        console.log(err);
        valid = false;
      } else {
        files.every(v => {
          valid = false;
          return false;
        });
      }
      resolve(valid);
    });
  });
}

export function getFolderContent(filePath) {
  //Poner await en uso
  return new Promise(async (resolve, reject) => {
    let content = [];
    await fs.readdir(filePath, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(item => {
          content.push(item);
        });
      }
      resolve(content);
    });
  });
}

export function loadCurrentFolder() {
  return fs.readdir(currentPath);
}
