interface GtagEventParams {
  [key: string]: string | number | boolean | undefined;
}

interface Window {
  gtag?: (command: 'event', action: string, params?: GtagEventParams) => void;
}
