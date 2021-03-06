define('YScaleMenuPlugin/main', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/Deferred',
    'dojo/dom-construct',
    'dijit/form/Button',
    'dojo/fx',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/on',
    'dojo/query',
    'dojo/dom-geometry',
    'JBrowse/Plugin',
    'dijit/MenuItem',
    "JBrowse/Browser",
    'YScaleMenuPlugin/View/Dialog/YScaleDialog'
],
  function (
    declare,
    array,
    lang,
    Deferred,
    domConstruct,
    dijitButton,
    coreFx,
    dom,
    style,
    on,
    query,
    domGeom,
    JBrowsePlugin,
    dijitMenuItem,
    Browser,
    YScaleDialog
  ) {

    return declare(JBrowsePlugin, {
      constructor: function (args) {
        var baseUrl = this._defaultConfig().baseUrl;
        this.config.version = '1.1.2';
        console.log("YScaleMenuPlugin plugin starting - v", this.config.version);
        var thisB = this;
        var browser = this.browser;
        if (browser.config.show_nav) {
          browser.afterMilestone('initView', function () {
            browser.addGlobalMenuItem('view', new dijitMenuItem({
              label: 'Set y-scale position',
              iconClass: 'yScaleIcon',
              id: 'menubar_yscale',
              title: 'Set location of y-axis scale for visible tracks',
              onClick: function () {
                new YScaleDialog({
                  height: 50,
                  browser: browser
                }).show();
              }
            }));
          });
        } // end browser.config.show_nav
        // 
      } // end constructor
    });
  });
