define("YScaleMenuPlugin/View/Dialog/YScaleDialog", [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/dom-class',
    'dijit/focus',
    'dijit/registry',
    'dojo/_base/array',
    'dijit/form/TextBox',
    'dijit/form/CheckBox',
    'JBrowse/View/Dialog/WithActionBar',
    'dojo/on',
    'dijit/form/Button',
    'dijit/form/RadioButton',
    'JBrowse/Model/Location'
],
  function (declare, lang, dom, domClass, focus, registry, array, dijitTextBox, dijitCheckedMenuItem, ActionBarDialog, on, Button, dijitRadioButton, Location) {

    return declare(ActionBarDialog, {
      /**
       * Dijit Dialog subclass to location of the y-scale for visible tracks
       */

      title: 'Set y-scale location',
      //title: '<img src="plugins/SmallRNAPlugin/img/smrna-filter-blank.png" height="16px" width="16px" id="smrna-filter-dialog-img">Filter all visible smRNA tracks',
      //autofocus: false,

      constructor: function (args) {
        this.browser = args.browser;
        this.visibleTracks = array.filter(this.browser.view.visibleTracks(), function (track) {
          return !((/Sequence$/.test(track.config.type)) || (/Sequence$/.test(track.config.trackType)))
        });
        this.countClicks = {
          'left': 0,
          'center': 0,
          'right': 0,
          'none': 0
        };
        this.storeClicks = {};
        this.registerClicks = this._initializeLocations();
        this.setCallback = args.setCallback || function () {};
        this.cancelCallback = args.cancelCallback || function () {};
        //console.log(this.countClicks);
      },

      _initializeLocations: function () {
        var out = {};
        var thisB = this;

        array.forEach(this.visibleTracks, function (track) {
          var curPos = (track.config.yScalePosition === undefined ? 'center' : track.config.yScalePosition);
          thisB.countClicks[curPos] += 1;
          thisB.storeClicks[track.config.label] = curPos;
          out[track.config.label] = null;
        });
        return out;
      },

      _fillActionBar: function (actionBar) {
        var dialog = this;
        var ok_button = new Button({
          label: "Apply",
          onClick: dojo.hitch(this, function () {
            //console.log(this.registerClicks);
            array.forEach(dialog.visibleTracks, function (track) {
              if (dialog.registerClicks[track.config.label] !== null) {
                track.config.yScalePosition = dialog.registerClicks[track.config.label];
                track.trackHeightChanged = true;
                track.updateUserStyles({
                  yScalePosition: dialog.registerClicks[track.config.label]
                });
                // for canvas-feature type tracks, we need to remove the y-scale
                if (dialog.registerClicks[track.config.label] === 'none' && track.config.hasOwnProperty('histograms')) {
                  track.removeYScale();
                }
              }
            });
            this.setCallback && this.setCallback();
            this.hide();
          })
        }).placeAt(actionBar);

        var cancel_button = new Button({
          label: "Cancel",
          onClick: dojo.hitch(this, function () {
            this.cancelCallback && this.cancelCallback();
            this.hide();
          })
        }).placeAt(actionBar);
      },

      show: function (callback) {
        var dialog = this;
        var locationList = ['left', 'center', 'right', 'none'];
        dojo.addClass(this.domNode, 'y-scale-dialog');
        var mainTable = dom.create('table', {
          id: 'y-scale-dialog-main'
        });
        // check boxes for change all
        var tabelRow = dom.create('tr', {
          id: 'y-scale-dialog-row-boxes'
        }, mainTable);
        dom.create('td', {
          innerHTML: 'Select for all',
          class: 'y-scale-dialog-td-key'
        }, tabelRow);
        array.forEach(locationList, function (loc) {
          var box = new dijitCheckedMenuItem({
            name: 'checkbox-' + loc,
            id: 'yscale-dialog-checkbox-' + loc,
            value: loc,
            class: 'yscale-checkbox'
          });
          box.onClick = dojo.hitch(dialog, '_registerCheck', box);
          var td = dom.create('td', {
            class: 'yscale-dialog-td-button'
          }, tabelRow);
          box.placeAt(td, 'first');
          dom.create('label', {
            "for": 'yscale-dialog-checkbox-' + loc,
            innerHTML: loc
          }, td);
        });
        dialog._manageCheckboxes();

        array.forEach(dialog.visibleTracks, function (track) {
          var trackLabel = track.config.label;
          var tableRow = dom.create('tr', {
            id: 'y-scale-dialog-row-' + trackLabel
          }, mainTable);
          dom.create('td', {
            innerHTML: track.config.key,
            class: 'y-scale-dialog-td-key'
          }, tableRow);
          /*var curPos = (track.config.yScalePosition === undefined ? 'center' : track.config.yScalePosition);*/
          var curPos = dialog.storeClicks[trackLabel];
          var formattedLabel = trackLabel.replace(/\./g, '-');
          array.forEach(locationList, function (loc) {
            var button = new dijitRadioButton({
              name: 'yscale-' + formattedLabel,
              checked: loc === curPos,
              id: 'yscale-dialog-radio-' + formattedLabel + '-' + loc,
              value: loc,
              _label: trackLabel
            });
            button.onClick = dojo.hitch(dialog, '_registerClick', button);
            var td = dom.create('td', {
              class: 'yscale-dialog-td-button'
            }, tableRow);
            button.placeAt(td, 'first');
            dom.create('label', {
              "for": 'yscale-dialog-radio-' + formattedLabel + '-' + loc,
              innerHTML: loc
            }, td);
          });
        });

        this.set('content', [
            mainTable
        ]);

        this.inherited(arguments);
        this.domNode.style.width = 'auto';
      },

      _registerClick: function (button) {
        if (button.checked && this.registerClicks.hasOwnProperty(button._label)) {
          var oldVal = this.storeClicks[button._label];
          this.registerClicks[button._label] = button.value;
          this.storeClicks[button._label] = button.value;
          this.countClicks[button.value] += 1;
          this.countClicks[oldVal] -= 1;
        }
        this._manageCheckboxes();
      },

      _registerCheck: function (box) {
        var thisB = this;
        array.forEach(thisB.visibleTracks, function (track) {
          var newVal = (box.checked ? box.value : 'center');
          var label = track.config.label;
          var formattedLabel = label.replace(/\./g, '-');
          var oldVal = (thisB.registerClicks[label] === null ? track.config.yScalePosition : thisB.registerClicks[label]);
          oldVal = (oldVal === undefined ? 'center' : oldVal);
          // update
          thisB.countClicks[newVal] += 1;
          thisB.countClicks[oldVal] -= 1;
          thisB.registerClicks[label] = newVal;
          thisB.storeClicks[label] = newVal;
          var button = registry.byId('yscale-dialog-radio-' + formattedLabel + '-' + (newVal === undefined ? 'center' : newVal));
          if (button)
            button.set('checked', true);
        });
        this._manageCheckboxes();
        //console.log(this.countClicks);
      },

      _manageCheckboxes: function () {
        var thisB = this;
        var maxL = thisB.visibleTracks.length;
        //console.log(this.countClicks);
        var locationList = ['left', 'center', 'right', 'none'];
        array.forEach(locationList, function (loc) {
          var box = registry.byId('yscale-dialog-checkbox-' + loc);
          var tCount = thisB.countClicks[loc];
          if (tCount === maxL) {
            box.set('checked', true);
            if (domClass.contains(box.domNode, 'indeterminate'))
              domClass.remove(box.domNode, 'indeterminate');
            //box.set('indeterminate', false);
          } else if (tCount > 0 && tCount < maxL) {
            box.set('checked', false);
            domClass.add(box.domNode, 'indeterminate');
            //console.log(box);
          } else {
            box.set('checked', false);
            //box.set('indeterminate', false);
            if (domClass.contains(box.domNode, 'indeterminate'))
              domClass.remove(box.domNode, 'indeterminate');
          }
        });
      },

      hide: function () {
        this.inherited(arguments);
        window.setTimeout(dojo.hitch(this, 'destroyRecursive'), 500);
      }
    });
  });
