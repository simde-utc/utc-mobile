# Services


## Storage

```
import Storage from "./src/service/Storage";
```
puis, dans une fonction JSX synchrone
```
let storage = new Storage();
storage.writeData("clef", "valeur");
storage.readData("clef").then((value)=>console.log(value));
```
