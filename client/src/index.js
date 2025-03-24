import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import { Provider } from 'react-redux';
import store from './store/redux';
import './i18n';
import App from 'app';

ReactDOM.render(
	<Provider store={store}>
		<ChakraProvider theme={theme}>
			<React.StrictMode>
				<ThemeEditorProvider>
					<App/>
				</ThemeEditorProvider>
			</React.StrictMode>
		</ChakraProvider>
	</Provider>,
	document.getElementById('root')
);