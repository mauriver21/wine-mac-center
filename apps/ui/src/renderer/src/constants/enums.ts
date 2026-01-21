export enum ProcessStatus {
  InProgress = 'inProgress',
  Success = 'success',
  Pending = 'pending',
  Cancelled = 'cancelled',
  Error = 'error'
}

export enum ExitCode {
  SuccessfulExecution = 0,
  Error = 1,
  PermissionsError = 126,
  ImproperCommand = 2
}

export enum FileName {
  ElectronAsar = 'app.asar',
  CFBundleExecutable = 'winemacapp',
  CFBundleIconFile = 'winemacapp.icns'
}

export const FileFilter = {
  Images: [{ extensions: ['jpg', 'jpeg', 'png', 'icns'], name: 'images' }],
  WindowsExecutables: [{ extensions: ['exe', 'msi', 'bat', 'cmd'], name: 'executables' }]
};

export enum ScriptOperation {
  DOWNLOAD = 'DOWNLOAD',
  DECOMPRESS = 'DECOMPRESS',
  COPY = 'COPY',
  REMOVE = 'REMOVE',
  RUN_WINDOWS_EXE = 'RUN_WINDOWS_EXE',
  SET_MAIN_EXE = 'SET_MAIN_EXE',
  MOUNT_DISK_IMAGE = 'MOUNT_DISK_IMAGE',
  UNMOUNT_DISK_IMAGE = 'UNMOUNT_DISK_IMAGE',
  DOWNLOAD_STEAM_APP = 'DOWNLOAD_STEAM_APP'
}

export enum ConfigOrigin {
  CLOUD = 'CLOUD',
  SCRIPTS = 'SCRIPTS',
  INSTALLED_APP = 'INSTALLED_APP',
  ALL_EXCEPT_INSTALLED_APP = 'ALL_EXCEPT_INSTALLED_APP'
}

export enum PipelineAction {
  RUN = 'RUN',
  RESUME = 'RESUME'
}
