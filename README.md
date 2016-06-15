#Y-Scale Menu Plugin
This is a JBrowse plugin
 
This plugin allows the user to set the position of the y-axis scale for all visible tracks using a dialog with radio buttons (rather than changing via track configuration)

##Install

For JBrowse 1.11.6+ in the _JBrowse/plugins_ folder, type:  
``git clone https://github.com/bhofmei/jbplugin-yscale.git YScaleMenuPlugin``

##Activate
Add this to jbrowse.conf:
    ``"plugins": [
        'YScaleMenuPlugin'
    ],``

If that doesn't work, add this to jbrowse_conf.json:
    ``"plugins" : {
        "YScaleMenuPlugin" : { "location" : "plugins/YScaleMenuPlugin" }
    }``
    
##Use
Open the dialog box by selecting "Set y-scale position" in the **View** menu. All visible tracks will be displayed as a row with the current configuration checked. Simply toggle the radio buttons for tracks you wish to change and click "Apply".
