import { LocalStorage, SessionStorage, Dark } from 'quasar';
import { qBreadCumbsEl } from 'src/js/Content.ts';

//Estableciendo el nombre de las claves que se van a usar
var Keys = [
  'kFirstTime',
  'kStarted',
  'kDarkMode',
  'kMainFolderLocation',
  'kMediaFolderLocation',
  'kMainFolderView',
  'kDynamicTitle',
  'kDropboxToken'
];
var DValues = [true, false, false, '', '', 'Grid', true, ''];

if ((LocalStorage.getLength = 0)) {
  resetValuesToDefault();
}

export const DefinitiveStorage = LocalStorage;
export const TemporalStorage = SessionStorage;
//sPath corresponde a UserPath en FileManager/FMM
//sRealPath corresponde a CurrentPath en FileManager/FMM
//sLastFolderColor corresponde al color de la ultima carpeta
//sLastSheetColor corresponde al color de la ultima hoja
//sLastView corresponde a la ultima vista utilizada en una carpeta
//sEditName corresponde al nombre del archivo
//sEditPath corresponde a la ruta del archivo que es/será editado
//sEditIcon corresponde al icono que será editado
//sBreadFolders es una array de objetos que se convertirán en q-breadcrumbs-el

if (SessionStorage.getLength == 0) {
  TemporalStorage.set('sRealPath', '');
  TemporalStorage.set('sPath', '');
  TemporalStorage.set('sLastFolderColor', '#c62219');
  TemporalStorage.set('sLastSheetColor', '#c62219');
  TemporalStorage.set('sLastView', 'Grid');
  TemporalStorage.set('sEditName', '');
  TemporalStorage.set('sEditPath', '');
  TemporalStorage.set('sEditIcon', '');
  TemporalStorage.set('sBreadFolders', [new qBreadCumbsEl()]);
  TemporalStorage.set('sDropboxStatus', '');
}

export function load() {
  //Obteniendo valores y estableciendo un valor por defecto en el caso que no existan.
  let LocalKeys = LocalStorage.getAllKeys(); //Obtiene los valores encontrados en el archivo
  if (Keys.length != LocalKeys.length) {
    //Si no coincide el numero, toca un reset
    resetValuesToDefault();
    return;
  }
  LocalKeys.forEach(key => {
    if (Keys.includes(key)) {
      //Si la clave está definida y hay el mismo nº de keys...
      let unTestedKeyIndex = Keys.indexOf(key);
      if (Keys[unTestedKeyIndex] == undefined) {
        //Mira si no tiene un valor
        LocalStorage.set(key, getDefaultByName(key));
      }
    } else {
      //Versión distinta o sobra alguna, toca un reset.
      resetValuesToDefault();
      return;
    }
  });
  Dark.set(LocalStorage.getItem('kDarkMode'));
}

function getDefaultByName(key) {
  let value;
  let keyPos = Keys.indexOf(key);
  value = DValues[keyPos];
  return value;
}

export function resetValuesToDefault() {
  LocalStorage.clear;
  for (let i = 0; i < Keys.length; i++) {
    LocalStorage.set(Keys[i], DValues[i]);
  }
}

export function get(key) {
  return LocalStorage.getItem(key);
}

export function set(key, value) {
  LocalStorage.set(key, value);
}

export function update() {
  Dark.set(LocalStorage.set('kDarkMode', LocalStorage.getItem('KDarkMode')));
}
