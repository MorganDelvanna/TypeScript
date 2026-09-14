$(function(){
    $('#monthInput').on('change', function() {
        let month = parseInt($(this).val());
        $('[data-month!="' + month + '"]').hide();  
        $('[data-month="' + month + '"]').show();

        $('#eventGrid tbody tr:visible').each(function (i) {
        if ((i + 1) % 4 === 0) {
            $(this).addClass('alt');
            $(this).prev().addClass('alt');
        }
        });
    });
});  