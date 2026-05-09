export const spawnLog = {
  onStdOut: (data: string | number | null) => {
    console.log(data);
  },
  onStdErr: (data: string | number | null) => {
    console.log(data);
  },
  onExit: (data: string | number | null) => {
    console.log(data);
  }
};
