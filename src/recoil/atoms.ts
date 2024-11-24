import { atom } from 'recoil';

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  image: string;
}

export const favoritesState = atom<Cryptocurrency[]>({
  key: 'favoritesState',
  default: [],
  effects: [
    ({ setSelf, onSet }) => {
      // Load favorites from localStorage on initialization
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setSelf(JSON.parse(savedFavorites));
      }

      // Save favorites to localStorage whenever they change
      onSet((newValue) => {
        if (newValue) {
          localStorage.setItem('favorites', JSON.stringify(newValue));
        }
      });
    },
  ],
});

export const themeAtom = atom<'light' | 'dark'>({
  key: 'themeAtom',
  default: 'light', // default theme is 'light'
  effects: [
    ({ setSelf, onSet }) => {
      // Load theme from localStorage on initialization
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) {
        setSelf(savedTheme);
      }

      // Save theme to localStorage whenever it changes
      onSet((newValue) => {
        if (newValue) {
          localStorage.setItem('theme', newValue);
        }
      });
    },
  ],
});


