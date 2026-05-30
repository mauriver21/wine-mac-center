export const scrollIntoView = (
  id: string,
  options?: {
    offset?: number;
    containerId?: string;
  },
) => {
  const { offset = 64, containerId = 'root' } = options || {};
  const element = document.getElementById(id);

  if (element) {
    const top = element?.offsetTop - offset;
    const container = document.getElementById(containerId) || window;
    container.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
};
