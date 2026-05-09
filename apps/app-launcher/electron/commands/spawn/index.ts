import {
  ChildProcessWithoutNullStreams,
  spawn as nodeSpawn,
} from 'child_process';
import { v4 as uuid } from 'uuid';
import { singleton } from '../../singleton';
import { ElectronApi } from '../../types/ElectronApi';

const processMap = new Map<string, ChildProcessWithoutNullStreams>();

export const spawn = (
  _: Electron.IpcMainInvokeEvent,
  command: string,
  action?: { type: string; data: string },
) => {
  const { mainWindow } = singleton;
  const child = nodeSpawn(command, {
    stdio: 'pipe',
    shell: true, // Required to run the whole string in a shell
  });

  const processId = String(child.pid || uuid());
  child.pid && processMap.set(processId, child);

  if (action?.type === 'stdIn') {
    child.stdin.write(action?.data);
    child.stdin.end();
  } else if (action?.type === 'stdInEnd' || action?.type === 'exit') {
    child.stdin.end();
  }

  return new Promise((resolve) => {
    child.stdout.on('data', async (data) => {
      mainWindow?.webContents.send(ElectronApi.SpawnStdout, data.toString());
    });

    child.stderr.on('data', async (data) => {
      mainWindow?.webContents.send(ElectronApi.SpawnStderr, data.toString());
    });

    child.on('exit', async (code) => {
      mainWindow?.webContents.send(ElectronApi.SpawnExit, code);
      processMap.delete(processId);
      resolve({ pid: child.pid });
    });
  });
};
