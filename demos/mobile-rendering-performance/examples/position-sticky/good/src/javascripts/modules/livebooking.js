window.setTimeout(function(){
    // Live Booking
    $.getScript('https://secure.livebookings.com/lbui/plugins/direct/lbui.direct.min.js',function(){
        $('#reservierung').lbuiDirect({
            connectionid: 'DE-RES-ARABESQ_210669:51412',
            language: 'de-DE',
            style: {
                baseColor: 'cccccc',
                pageColor: '000000',
                highlightColor: 'ff0000',
                borderStyle: 0,
                borderColor: '000000'
            },
            modalWindow: {
                enabled: true
            }
        });
    });
},1000);