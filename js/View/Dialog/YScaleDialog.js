define( "YScaleMenuPlugin/View/Dialog/YScaleDialog", [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
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
function( declare, lang, dom, focus, registry, array, dijitTextBox, dijitCheckedMenuItem, ActionBarDialog, on, Button, dijitRadioButton, Location ) {

return declare (ActionBarDialog,{
    /**
    * Dijit Dialog subclass to location of the y-scale for visible tracks
    */

    title: 'Set y-scale location',
    //title: '<img src="plugins/SmallRNAPlugin/img/smrna-filter-blank.png" height="16px" width="16px" id="smrna-filter-dialog-img">Filter all visible smRNA tracks',
    //autofocus: false,

    constructor: function( args ){
        this.browser = args.browser;
        this.visibleTracks = this.browser.view.visibleTracks();
        this.registerClicks = this._initializeLocations();
        this.setCallback    = args.setCallback || function() {};
        this.cancelCallback = args.cancelCallback || function() {};
    },
    
    _initializeLocations: function(){
        var out={};
        array.forEach(this.visibleTracks,function(track){
            var curPos = (track.config.yScalePosition === undefined ? 'center' : track.config.yScalePosition);
            //console.log(curPos);
            out[track.config.label] = null;
        });
        return out;
    },

    _fillActionBar: function( actionBar ){
        var dialog=this;
        var ok_button = new Button({
        label: "Apply",
        onClick: dojo.hitch( this, function() {
            console.log(this.registerClicks);
            array.forEach(dialog.visibleTracks,function(track){
                if(dialog.registerClicks[track.config.label] !== null){
                    track.config.yScalePosition = dialog.registerClicks[track.config.label];
                  track.trackHeightChanged=true;
                    track.updateUserStyles( {yScalePosition:dialog.registerClicks[track.config.label]});
                    // for canvas-feature type tracks, we need to remove the y-scale
                    if(dialog.registerClicks[track.config.label] === 'none' && track.config.hasOwnProperty('histograms')){
                        track.removeYScale();
                    }
                }
            })
            this.setCallback && this.setCallback( );
            this.hide();
        })
    }).placeAt(actionBar);

    var cancel_button = new Button({
        label: "Cancel",
        onClick: dojo.hitch(this, function() {
            this.cancelCallback && this.cancelCallback();
            this.hide();
        })
    }).placeAt(actionBar);
    },

    show: function( callback ) {
        var dialog = this;
        var locationList = ['left','center','right','none'];
        dojo.addClass( this.domNode, 'y-scale-dialog' );
        var mainTable = dom.create('table',{id:'y-scale-dialog-main'});
        array.forEach(dialog.visibleTracks, function(track){
            var trackLabel = track.config.label;
            var tableRow = dom.create('tr',{id:'y-scale-dialog-row-'+trackLabel}, mainTable);
            dom.create('td',{innerHTML:track.config.key,class:'y-scale-dialog-td-key'}, tableRow);
            var curPos = (track.config.yScalePosition === undefined ? 'center' : track.config.yScalePosition);
            array.forEach(locationList, function(loc){
                var button = new dijitRadioButton({
                   name:'yscale-'+trackLabel,
                    checked: loc === curPos,
                    id:'yscale-dialog-radio-'+trackLabel+'-'+loc,
                    value: loc,
                    _label: trackLabel
                });
                button.onClick = dojo.hitch(dialog, '_registerClick', button);
                var td = dom.create('td',{class:'yscale-dialog-td-button'},tableRow);
                button.placeAt(td,'first');
                dom.create('label',{"for":'yscale-dialog-radio-'+trackLabel+'-'+loc, innerHTML: loc}, td);
            });
        });

        this.set('content', [
            mainTable
        ] );

        this.inherited( arguments );
        this.domNode.style.width = 'auto';
    },
    
    _registerClick: function(button){
      if(button.checked && this.registerClicks.hasOwnProperty(button._label)){
         this.registerClicks[button._label] = button.value
        }
    },

    hide: function() {
        this.inherited(arguments);
        window.setTimeout( dojo.hitch( this, 'destroyRecursive' ), 500 );
    }
});
});