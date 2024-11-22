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
