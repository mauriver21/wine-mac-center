export const findOutputPID = (output: string) => {
  const match = output.match(/\[PID_START](\d+)\[PID_END]/);
  const pid = match ? parseInt(match[1], 10) : null;
  return pid;
};
