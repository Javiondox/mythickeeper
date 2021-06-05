//import { Content, SheetContent, FolderContent, RootFolderContent } from 'Content.js'
/*import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from '@capacitor/core';*/
/*const { Filesystem } = Plugins;*/

const UserPrefs = require('src/js/UserPrefs.js');

var rootPath = UserPrefs.get('kMainFolderLocation'); //Path verdadero hasta la carpeta root
var mediaPath = UserPrefs.get('kMediaFolderLocation');
var currentPath = UserPrefs.TemporalStorage.getItem('sRealPath'); //Path verdadero completo
var userPath = UserPrefs.TemporalStorage.getItem('sPath'); //Path falso DESDE la carpeta root

// Paridad con path

export function pathGetFile(path) {
  path.replace(/^.*[\\\/]/, '');
}

export function pathGetExt(path) {
  return (
    '.' +
    path
      .replace(/^.*[\\\/]/, '')
      .split('.')
      .pop()
  );
}

export function pathGetName(path) {
  return pathGetFile(path).replace(pathGetExt(path), '');
}

// Fin de paridad con path

if (UserPrefs.get('kMainFolderLocation') != '' || undefined) {
  setRootPath(UserPrefs.get('kMainFolderLocation'));
}

export function getRootPath() {
  return this.rootPath;
}

export function setCurrentPath(newCurrentPath) {
  currentPath = newCurrentPath;
  userPath = currentPath.replace(rootPath, '');
  UserPrefs.TemporalStorage.set('sPath', userPath);
  UserPrefs.TemporalStorage.set('sRealPath', currentPath);
}

export function getCurrentPath() {
  return this.currentPath;
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

/*
	Operaciones

*/

export async function loadFile(filePath) {
  return await Filesystem.readFile(
    filePath,
    {
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    },
    () => {
      console.log('FMM: Fallo en la lectura de fichero');
    }
  );
}

export async function writeFile(filepath, dataObj) {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function(fs) {
      fs.root.getFile(
        filepath,
        { create: true, exclusive: false },
        function(fileEntry) {
          fileEntry.createWriter(
            function(fileWriter) {
              fileWriter.onwriteend = function() {
                console.log('Successful file write...');
                readFile(fileEntry);
              };

              fileWriter.onerror = function(e) {
                console.log('Failed file write: ' + e.toString());
              };

              if (!dataObj) {
                dataObj = new Blob([''], { type: 'text/plain' });
              }

              fileWriter.write(dataObj);
            },
            e => {
              console.log(e);
            }
          );
        },
        e => {
          console.log(e);
        }
      );
    },
    e => {
      console.log(e);
    }
  );
}

export async function renameContent(filepath, futurefilepath) {
  return await FileSystem.rename(filepath, futurefilepath, () => {
    console.log('FMM: Fallo en renombrado de fichero');
  });
}

export async function renameJSON(filepath, futurefilepath) {
  try {
    let content = await JSON.parse(await loadFile(filepath + '.json'));
    content.name = pathGetName(futurefilepath);
    await writeFile(futurefilepath + '.json', JSON.stringify(content));
    await removeProtoFile(filepath + '.json');
  } catch (e) {
    console.log(e);
  }
}

export async function renameFolder(filepath, futurefilepath) {
  await renameContent(filepath, futurefilepath);
  await renameJSON(filepath, futurefilepath + '.json');
}

export async function renameSheet(filepath, futurefilepath, name) {
  await renameContent(filepath + '.md', futurefilepath + '.md');
  await renameJSON(filepath + '.json', futurefilepath + '.json');
}

export async function getValidContent(filepath, type = 'all') {
  var content = await getFolderContent(filepath);
  var validContent = [];
  //Filtrado rápido
  switch (type) {
    //Json de las carpetas
    case 'folders':
      validContent.push(
        content.filter((a = '') => {
          if (pathGetExt(a) == '.json') {
            if (content.includes(pathGetName(a))) {
              return a;
            }
          }
        })
      );
      break;
    case 'sheets':
      //Json de los Archivos
      validContent.push(
        content.filter((a = '') => {
          if (pathGetExt(a) == '.json') {
            if (content.includes(pathGetName(a) + '.md')) {
              return a;
            }
          }
        })
      );
      break;
    default:
      if (pathGetExt(a).ext == '.md' || '.json' || '') {
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

//removeContent es dividido en dos, ya que en NodeJS puede ser más general.
export async function removeProtoFile(filepath) {
  await Filesystem.rmdir(filepath, () => {
    console.log('FMM: No se pudo borrar la carpeta');
  });
}

export async function removeProtoFolder(filepath) {
  await Filesystem.deleteFile(filepath, () => {
    console.log('FMM: No se pudo borrar el archivo');
  });
}

export async function removeFolder(filepath) {
  await removeProtoFolder(filepath);
  await removeProtoFile(filepath + '.json');
}

export async function removeSheet(filepath) {
  await removeProtoFile(filepath + '.md');
  await removeProtoFile(filepath + '.json');
}

export async function createSheet(filepath) {
  await writeFile(filepath + '.md', '');
}

export function copy(origin, destination) {
  Filesystem.copy({
    from: origin,
    to: destination
  });
}

export function copyFolder(origin, destination) {
  copy(origin, destination);
  try {
    copy(origin + '.json', destination + '.json');
  } catch (e) {}
}

export function copyMarkdown(origin, destination) {
  copy(origin + '.md', destination + '.md');
  try {
    copy(origin + '.json', destination + '.json');
  } catch (e) {}
}

export function getDocumentsURI(path) {
  return Filesystem.getURI({
    path: path,
    directory: this.Directory.Documents
  });
}

/* 
- Operaciones con carpetas 
*/

export async function createFolder(filepath) {
  window.requestFileSystem(
    LocalFileSystem.PERSISTENT,
    0,
    function(fs) {
      console.log('file system open: ' + fs.name);
      fs.root.getFile(
        filepath,
        { create: true, exclusive: false },
        function(fileEntry) {
          console.log('fileEntry is file?' + fileEntry.isFile.toString());
          // fileEntry.name == 'someFile.txt'
          // fileEntry.fullPath == '/someFile.txt'
          writeFile(fileEntry, null);
        },
        onErrorCreateFile
      );
    },
    onErrorLoadFs
  );

  /*try {
    return await Filesystem.mkdir({
      path: filepath,
      directory: Directory.Documents,
      recursive: false
    });
  } catch (e) {
    console.log('FMM: No se pudo crear el directorio: ' + e);
  }*/
}

// CreateRootFolder, setRootFolder, checkIfRootFolder y checkIfEmpty no implementados

export async function getFolderContent(filepath) {
  try {
    return await Filesystem.readdir({
      path: filepath,
      directory: Directory.Documents
    });
  } catch (e) {
    console.error('FMM: No se pudo leer el directorio', e);
  }
}

export function loadCurrentFolder() {
  return getFolderContent(currentPath);
}
