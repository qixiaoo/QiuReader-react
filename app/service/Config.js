class Config {

  // 获取默认的配置
  static getDefaultConfigObj() {
    return {
      theme: true,
      colors: ['#FBF1D1', '#EFEEB0', '#CAEFC9', '#76BEE9'],
      background: '#FFF',
      fontSize: 0, // 0 代表使用默认值
      lineHeight: 0, // 0 代表使用默认值
      letterSpacing: 0, // 0 代表使用默认值
      wordSpacing: 0, // 0 代表使用默认值
      column: 2, // 可取值为1, 2
      padding: 10, // 阅读区域与浏览器可视区域上下的间距
      gutter: 80, // 阅读区域与浏览器可视区域两侧的间距
      disablePopup: false,
    };
  }

  // 获取config对象
  static get() {
    let json = localStorage.getItem('config');

    return JSON.parse(json) || Config.getDefaultConfigObj();
  }

  // 更新config
  static set(key, value) {
    let json = localStorage.getItem('config');
    let config = JSON.parse(json) || Config.getDefaultConfigObj();
    config[key] = value;
    localStorage.setItem('config', JSON.stringify(config));
  }

  // 重置Config
  static resetConfig() {
    let json = JSON.stringify(Config.getDefaultConfigObj());
    localStorage.setItem('config', json);
  }

  // 获取为文档默认应用的css样式
  static getDefaultCss() {
    let config = Config.get();
    let colors = config.colors;

    let css1 = `::selection{background:#f3a6a68c}::-moz-selection{background:#f3a6a68c}[class*=color-]:hover{cursor:pointer;background-image:linear-gradient(0,rgba(0,0,0,.075),rgba(0,0,0,.075))}.color-0{background-color:${colors[0]}}.color-1{background-color:${colors[1]}}.color-2{background-color:${colors[2]}}.color-3{background-color:${colors[3]}}`;

    let css2 = [
      'a, article, cite, code, div, li, p, pre, span, table {',
      `    font-size: ${config.fontSize+'px'} !important;`,
      `    line-height: ${config.lineHeight+'px'} !important;`,
      `    letter-spacing: ${config.letterSpacing+'px'} !important;`,
      `    word-spacing: ${config.wordSpacing+'px'} !important;`,
      '}',
      'img {',
      '    max-width: 100% !important;',
      '}',
      'body {',
      '    background-color: transparent !important;',
      `    color: ${config.theme ? '#000000de' : '#f5f5f5'} !important;`,
      '}',
    ];

    css2[1] = config.fontSize ? css2[1] : '';
    css2[2] = config.lineHeight ? css2[2] : '';
    css2[3] = config.letterSpacing ? css2[3] : '';
    css2[4] = config.wordSpacing ? css2[4] : '';

    return (css1 + css2.join('\n'));
  }
}

export default Config;
