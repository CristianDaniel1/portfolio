// localStorage pode lançar erro (modo privado, cookies bloqueados etc.),
// então todo acesso passa por aqui.

export const readStorage = key => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // sem armazenamento disponível: a escolha vale só nesta visita
  }
};
