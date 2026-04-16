jQuery(document).ready(function($) {
    $('.lbbcMemberMoreInfo').click(function() {
        $(".companyTitle").text("");
        $(".companyDescription").text("");
        $(".member-industry").text("");
        $(".member-website").text("");
        $('.member-logo').html("");

        $('.popup-ajax-overlay').show();

        var getMembershipID = $(this).attr('data-membershipID');

        var reqData = {
            action: 'lbbc_gu_memberships_ajax_action',
            membershipID: getMembershipID
        };

        $.ajax({
            type: "POST",
            url: guLbbcAjax.ajaxurl,
            data: reqData,
            success: function(response){
                var responseData = JSON.parse(response);

                $(".companyTitle").text(responseData.name);
                $(".companyDescription").text(responseData.description);
                $(".member-industry").text(responseData.industry_txt);
                $(".member-website").text(responseData.website);

                var imageHtml = '';
                if(responseData.logo_uri.isSrc === true) {
                    imageHtml = '<img src="'+responseData.logo_uri.src+'" alt="'+responseData.name+'">';
                } else {
                    imageHtml = '<span class="company-letter-logo">'+responseData.logo_uri.src+'</span>';
                }
                $('.member-logo').html(imageHtml);

                $('.popup-ajax-overlay').hide();
                $('.ajax-overlay-end').show();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                $('.popup-ajax-overlay').hide();
                console.log(textStatus);
            }
        });
    });

    $('.ajax-close').click(function() {
        $('.ajax-overlay-end').hide();
    });
});
