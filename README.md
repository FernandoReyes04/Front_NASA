# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Configuración de la API de Google Maps

Este proyecto ya está preparado para usar una variable de entorno con la API Key de Google Maps. Sigue estos pasos:

1. Copia el archivo `.env.example` a `.env.local` en la raíz del proyecto.
2. Edita `.env.local` y coloca tu clave real:
   
   REACT_APP_GOOGLE_MAPS_API_KEY=TU_API_KEY_AQUI

3. Guarda los cambios y reinicia el servidor de desarrollo si estaba corriendo.

Notas importantes:
- Create React App solo expone variables que comienzan con `REACT_APP_`.
- No compartas ni confirmes tu clave real en git. Usa `.env.local` (no se debe subir al repositorio).
- El componente que consume esta variable es `src/components/MapPicker.tsx`, que la pasa a `@react-google-maps/api`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
