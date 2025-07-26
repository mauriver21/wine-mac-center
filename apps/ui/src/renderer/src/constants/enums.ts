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
  ImproperCommand = 2
}

export enum FileName {
  CFBundleExecutable = 'winemacapp',
  CFBundleIconFile = 'winemacapp.icns'
}

export const FileFilter = {
  Images: [{ extensions: ['jpg', 'jpeg', 'png', 'icns'], name: 'images' }],
  WindowsExecutables: [{ extensions: ['exe', 'msi', 'bat', 'cmd'], name: 'executables' }]
};

export enum WineAppMode {
  Create = 'Create',
  Update = 'Update'
}
