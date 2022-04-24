import 'styled-components'; //importação completa do styled-component
import theme from './theme';

declare module 'styled-components'{//acessa o styled-component e sobescreve o tema
    type ThemeType = typeof theme //copia os tipos inferidos do objeto theme para dentro da tipagem ThemeType

    export interface DefaultTheme extends ThemeType{} //pega a interface padrão e estende a theme type
};

