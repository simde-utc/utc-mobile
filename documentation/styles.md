# Styles

Les styles communs se trouvent dans le dossier `src/styles/`.
Le fichier `index.js` aggrège tous les styles.

## Utilisation

Pour une utilisation plus simple, utiliser la fonction `get(...paths)` de `styles` :
```
js
import styles from './path/to/styles/';

const titleStyle = styles.get('text.center', 'text.h1', 'text.blue', 'py.sm');
const title = () => <Text style={ titleStyle }>Ceci n'est pas un titre</Text>;
```

## Liste des styles

- **bg.<colors>** : bg.red
- **m<direction>.<space>** : mx.sm, m.lg...
- **p<direction>.<space>** : pb.md, pt.y...
- **text.<alignment>** : text.center, text.right...
- **text.<colors>** : text.yellow, text.blue...
- **container.center**
- **container.padded**