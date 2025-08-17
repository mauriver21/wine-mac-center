import { createWineApp } from '@utils/createWineApp';

export type WineApp = Awaited<ReturnType<typeof createWineApp>>;
