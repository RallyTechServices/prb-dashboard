Ext.define('Rally.technicalservices.window.Print',{
    extend: 'Ext.Window',
    logger: new Rally.technicalservices.Logger(),

    show: function(element, printAreaRatio){

        var win = window.open('', this.title, 'width=200,location=no,left=200px,toolbar=0,scrollbars=0,status =0');

        var maxPixelsPerPage = element.offsetWidth * printAreaRatio;

        var headerRow = element.getElementsByTagName('thead')[0];
        var rows = element.getElementsByTagName('tbody');
        var footerRow = element.getElementsByTagName('tfoot')[0];

        var current_date = Rally.util.DateTime.formatWithDefault(new Date());

        var pageHeight = 0,
            html = '<!DOCTYPE html><html><head><title>Executive Summary - Portfolio Highlights - Status as of: ' + current_date + ' </title>';
        html += '<style>' + this._getStyleSheet() + '</style></head>';

        html += '"<body onload=\"window.print(); window.close();\"><table class=\"prbtable\">';
        html += headerRow.outerHTML;
        pageHeight += headerRow.offsetHeight;

        var pageNumber = 1;

        for (var i=1; i<rows.length; i++){
            if ((pageHeight + rows[i].offsetHeight) > maxPixelsPerPage){
                html += footerRow.outerHTML.replace("pageNumber", "Page " + pageNumber++) + '</table><table class="prbtable">';
                pageHeight = headerRow.offsetHeight;
                html +=  headerRow.outerHTML;
            }
            html += rows[i].outerHTML;
            pageHeight += rows[i].offsetHeight;
        }
        html += footerRow.outerHTML.replace("pageNumber", "Page " + pageNumber++) + '</table></body></html>';

        win.document.write(html);
        win.document.close();
    },
    _getStyleSheet: function(){
        var style = "<style>" +
            "@page { size: letter landscape; margin: 0.1in 0.1in 0.1in 0.1in; }" +
            "@media all { " +
                    "body {margin: 5;}" +
                    "header {height: 0.5in; font-family: ProximaNovaSemiBold, Helvetica, Arial; text-align:center;width:100%;font-size:9pt;}" +
                    "footer {height: 0.25in; width:100%; page-break-after:always; vertical-align: bottom;}" +
                    "th.prb { background-color: #c0c0c0; padding: 0.1in; font-family: ProximaNovaSemiBold, Helvetica, Arial; font-size:10pt;}" +
                    "td.prb { padding-top:  0.1in; padding-bottom:  0.1in; padding-left:  0.1in; padding-right:  0.1in; font-size:9pt;font-family: ProximaNova, Helvetica, Arial; page-break-inside: avoid; page-break-after:auto; }" +
                    ".prb { border: 1px solid black; }" +
                    "thead {display: table-header-group;}" +
                    "table.prbtable{ border-collapse: collapse; width: 100%;page-break-after:always;}" +
                    ".prbheader { border:0; text-align:center; font-size:10pt; font-family: ProximaNova, Helvetica, Arial; padding:0.1in;}" +
                    ".fleft {vertical-align: bottom; padding-top: 0.25in;font-family: ProximaNova, Helvetica, Arial; text-align:left;font-size:9pt; }" +
                    ".fcenter {vertical-align: bottom;  font-family: ProximaNova, Helvetica, Arial; text-align:center;font-size:9pt;}" +
                    ".fright {vertical-align: bottom;  font-family: ProximaNova, Helvetica, Arial; text-align:right;font-size:9pt;}" +
                "}" +
            "</style>";

        return style;
    }
});