export const findOutputPids = (output: string) => {
  const match = output.match(/\[PIDS_START]([^\n\r]*)\[PIDS_END]/);
  const pid = match?.[1] || '';
  return pid;
};
