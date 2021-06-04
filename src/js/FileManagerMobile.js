//import { Content, SheetContent, FolderContent, RootFolderContent } from 'Content.js'
import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from '@capacitor/core';
const UserPrefs = require('src/js/UserPrefs.js');
const { Filesystem } = Plugins;

//TODO COPIAR LAS NORMALES
var rootPath = '~/mythicdebug'; //Path verdadero hasta la carpeta root
var currentPath = ''; //Path verdadero completo
var userPath = ''; //Path falso DESDE la carpeta root
var currentContent = {};

if (UserPrefs.get('kMainFolderLocation') != '' || undefined) {
  setRootPath(UserPrefs.get('kMainFolderLocation'));
}

export function normalize(path) {
  return path.normalize(path);
}

export function setRootPath(newRootPath) {
  this.rootPath = newRootPath;
}

export function getRootPath() {
  return this.rootPath;
}

export function setCurrentPath(newCurrentPath) {
  this.currentPath = newCurrentPath;
}

export function downCurrentPath(newFolder) {
  this.currentPath = path.normalize(this.currentPath + `/${newFolder}`);
}

export function upCurrentPath() {
  this.currentPath = path.normalize(this.currentPath + `/..`);
}

export function getCurrentPath() {
  return this.currentPath;
}

export function setUserPath(newUserPath) {
  this.userPath = newUserPath;
}

export function updateUserPath() {
  let newUserPath = this.currentPath.replace(this.rootPath, '');
  this.userPath = newUserPath;
}

export function getUserPath() {
  return this.userPath;
}

export function loadCurrentFolder() {
  return fs.readdir(currentPath);
}

export function loadFile(filePath) {
  return fs.readFile(filePath);
}

export async function writeFile(filePath, data) {
  await Filesystem.writeFile({
    path: 'MythicKeeper/' + filePath,
    data: data,
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8
  });
}

export function loadFileMeta(filePath) {
  let extname = path.extname(filePath);
  let filePathUntilName = filePath.replace(`.${extname}`, '');
  return JSON.parse(fs.readFile(filePathUntilName + '.meta'));
}

export function writeFileMeta(filePath, data) {
  let extname = path.extname(filePath);
  let filePathUntilName = filePath.replace(`.${extname}`, '');
  return JSON.stringify(fs.writeFile(filePathUntilName + '.meta', data));
}
