//-----------------FUNCTIONS-------------------//

/**
 * Init Value
 */
Session.setDefault("dataURL", null);
Session.setDefault("thumbLink", null);
var img, filename, contentUpload = [], largeImg = {}, mediumImg = {}, smallImg = {}, squareImg = {},
    FileList = [], multiPhotoLinks = [], videoFiles, videoLink, audioFile, audioLink;

/**
 * Start cropper when insert image file
 */

function startCropper(url, value) {
    var active = false;
    if (value === null)
        value = 3 / 2;
    if (active) {
        img.cropper('replace', url);
        imgSquare.cropper('replace', url);
    } else {
        img = $('<img id="image" src="' + url + '">');
        squareImg = $('<img id="image" src="' + url + '">');
        $('.cropperPreview').empty().html(img);
        img.cropper({
            aspectRatio: value,
            strict: false,
            crop: function (e) {
                var json = [
                    '{"x":' + e.x,
                    '"y":' + e.y,
                    '"height":' + e.height,
                    '"width":' + e.width,
                    '"rotate":' + e.rotate + '}'
                ].join();
            }
        });
        squareImg.cropper({
            aspectRatio: 1,
            autoCropArea: 0.8,
            strict: false
        });
        active = true;
    }
}

/**
 * Check if image file
 * @param file
 * @returns {boolean}
 */

function isImageFile(file) {
    if (file.type) {
        return /^image\/\w+$/.test(file.type);
    } else {
        return /\.(jpg|jpeg|png|gif)$/.test(file);
    }
}

/**
 * Convert dataUrl to blob object
 * @param dataurl
 * @returns {*}
 */

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(',');
    console.log(arr);
    var mime = "image/jpeg";
    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}


/**
 * Convert dataUrl (base64) to fileList
 * @param dataUrl
 * @param filename
 * @returns {Array}
 */

function blobToFile(dataUrl, filename) {
    var files = [];
    var file = new File([dataURLtoBlob(dataUrl)], filename, {
        type: "image/jpeg"
    });
    files.push(file);
    return files;
}

/**
 * Upload Images With 3 sizes
 */

function Upload(fileLarge, fileMedium, fileSmall, fileSquare, callback) {
    S3.upload({
        files: fileLarge,
        path: "tester/large",
        unique_name: false
    }, function (error, result) {
        if (error) throw error.reason;
        else {
            largeImg.key = result.relative_url;
            S3.upload({
                files: fileMedium,
                path: "tester/medium",
                unique_name: false
            }, function (err, result) {
                if (err) throw err.reason;
                else {
                    mediumImg.key = result.relative_url;
                    S3.upload({
                        files: fileSmall,
                        path: "tester/small",
                        unique_name: false
                    }, function (err, result) {
                        if (err) throw err.reason;
                        else {
                            smallImg.key = result.relative_url;
                            S3.upload({
                                files: fileSquare,
                                path: "tester/square",
                                unique_name: false
                            }, function (err, result) {
                                if (err) throw err.reason;
                                else {
                                    squareImg.key = result.relative_url;
                                    callback();
                                }
                            });
                        }
                    });
                }
            });
        }
    })
}

/**
 * Crop Image With 4 sizes then upload
 */

function croppedImage(callback, insertCallBack) {
    var imgLarge = img.cropper('getCroppedCanvas', {
        width: 614,
        height: 400
    });
    var imgMedium = img.cropper("getCroppedCanvas", {
        width: 470,
        height: 306
    });
    var imgSmall = img.cropper("getCroppedCanvas", {
        width: 242,
        height: 157
    });
    var imgSquare = squareImg.cropper("getCroppedCanvas", {
        width: 165,
        height: 165
    });
    var fileLarge = blobToFile(imgLarge.toDataURL("image/jpeg", 0.9), filename),
        fileMedium = blobToFile(imgMedium.toDataURL("image/jpeg", 0.9), filename),
        fileSmall = blobToFile(imgSmall.toDataURL("image/jpeg", 0.9), filename),
        fileSquare = blobToFile(imgSquare.toDataURL("image/jpeg", 0.9), filename);

    callback(fileLarge, fileMedium, fileSmall, fileSquare, insertCallBack);
}


/**
 * Stop cropper
 */

function stopCropper() {
    if (img !== null && typeof img !== "undefined")
        img.cropper("destroy");
    Session.set("dataURL", null);

    $('.tab-pane.active [name="thumbnailUpload"]').val("");
    $(".cropperPreview").empty();
    img = null;
}

/**
 * Reset All When post inserted
 */
function resetAll() {
    stopCropper();
    FileList = [];
    multiPhotoLinks = [];
    contentUpload = [];
    videoFiles = null, videoLink = null, audioFile = null, audioLink = null;
    Session.set('dataURL', null);
    Session.set('thumbLink', null);
    $('[name="uploadPhoto"]')[0].value = "";
    $('[name="mediaUpload"]')[0].value = "";
    $("div.thumbPreviewer").children().remove();
    $("div.upload-thumbnail").show();
    $(".multiPreview").children().remove();
    $('.mediaPreview').children().remove();
    $("div.upload-media").show();
    _.each($('.tab-pane form'), function (form) {
        form.reset();
    })
}

//-----------------FUNCTIONS-------------------//

Template.cropperModal.events({

    /**
     * Get Cropper Canvas
     */
    'click #cropperUpload': function (e, tmp) {
        if (img !== null && typeof img !== "undefined") {
            var result = img.cropper("getCroppedCanvas");
            var $currentTab = $(".tab-pane.active");
            if (typeof result !== "undefined") {
                $currentTab.children().find("div.thumbPreviewer").html('<img class="img-preview preview-lg" src="' + result.toDataURL() + '">');
                $currentTab.children().find("div.thumbPreviewer").append('<a href="#" class="js-af-remove-file"><i class="fa fa-times"></i> Remove</a>');
                $currentTab.children().find("div.upload-thumbnail").hide();
            } else {
                $currentTab.children().find("div.upload-thumbnail").show();
            }
            $("#cropperModal").modal("hide");
            Meteor.setTimeout(function () {
                $("body").addClass('modal-open');
            }, 1000);
        }
    },

    /**
     * Stop Cropper when close modal
     */
    'click .dismiss': function () {
        stopCropper();
    }
});

/**
 * Adding tinymce editor
 */
Template.postModal.onRendered(function () {
    tinymce.init({
        selector: '#editor',
        inline: true,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code'
        ],
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        file_browser_callback: function (field_name, url, type, win) {
            $('#my_form input').click();
            $('#my_form input').on("change", function () {
                S3.upload({
                    files: $('#my_form input')[0].files,
                    path: "tester/contentUpload",
                    unique_name: false
                }, function (err, result) {
                    contentUpload.push(result.relative_url);
                    top.$('.mce-btn.mce-open').parent().find('.mce-textbox').val(result.url).closest('.mce-window').find('.mce-primary').click();
                });
                //top.$('.mce-btn.mce-open').parent().find('.mce-textbox').val("https://www.youtube.com/watch?v=5Nys9u2ZD_A").closest('.mce-window').find('.mce-primary').click();
            })
        }
    });
});


Template.postModal.events({

    /**
     * Prevent Default
     */
    'submit form': function (e, tmp) {
        e.preventDefault();
    },

    /**
     * Open Cropper Modal
     */
    'click .upload': function () {
        $('.tab-pane.active [name="thumbnailUpload"]').click();
    },

    /**
     *  Input Thumb File
     */

    'change .tab-pane.active [name="thumbnailUpload"]': function () {
        var file;
        var files = $('.tab-pane.active [name="thumbnailUpload"]')[0].files;
        filename = files[0].name;
        if (files.length) {
            file = files[0];
            if (isImageFile(file)) {
                this.url = URL.createObjectURL(file);
                Session.set("dataURL", this.url);
                startCropper(this.url, null);
                $('#cropperModal').modal();
            }
        }
    },

    /**
     * Input Thumb Link
     */

    'change .tab-pane.active [name="link"]': function () {
        var thumbLink = $('.tab-pane.active [name="link"]').val();
        var $currentTab = $(".tab-pane.active");
        if (thumbLink !== null && thumbLink !== "") {
            if (/^http:\/\/.+\.(gif|png|jpg|jpeg)$/i.test(thumbLink)) {
                Session.set("thumbLink", thumbLink);
                $currentTab.children().find("div.thumbPreviewer").html('<img class="img-preview preview-lg" src="' + thumbLink + '">');
                $currentTab.children().find("div.thumbPreviewer").append('<a href="#" class="js-af-remove-file"><i class="fa fa-times"></i> Remove</a>');
                $currentTab.children().find("div.upload-thumbnail").hide();
            } else {
                $currentTab.children().find("div.upload-thumbnail").show();
            }
        }
    },

    /**
     * Remove Preview
     */
    'click .tab-pane.active .js-af-remove-file': function () {
        var $currentTab = $(".tab-pane.active");
        $currentTab.children().find("div.thumbPreviewer").children().remove();
        $currentTab.children().find("div.upload-thumbnail").show();

    },

    /**
     * Reset Input When CLose form url
     */
    'click .tab-pane.active .form-custom-url a': function () {
        $('.tab-pane.active [name="link"]').val("");
    },

    /**
     * Get Data Form Url
     */

    'change [name="addLink"]': function () {
        var url = $('[name="addLink"]').val();

        //Enable All Cors
        $.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
                options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
                //options.url = "http://cors.corsproxy.io/url=" + options.url;
            }
        });
        if (url !== "" && typeof url !== "undefined") {
            //Get Data from url
            $.get(url, function (res) {
                var responseText = res, title, desc, image, sitename, url;
                var div = document.createElement("div");
                div.innerHTML = responseText;
                title = div.getElementsByTagName("title");
                title = title.length ? title[0].innerHTML : undefined;
                var metas = div.getElementsByTagName("meta");
                _.each(metas, function (meta) {
                    property = meta.getAttribute("property");
                    if (property === "og:site_name")
                        sitename = meta.getAttribute("content");
                    if (property === "og:image" || property === "og:image:url")
                        image = meta.getAttribute("content");
                    if (property === "og:description")
                        desc = meta.getAttribute("content");
                });
                console.log(title);
                console.log(sitename);
                console.log(image);
                console.log(desc);
            })
        }
    },

    /**
     * Upload Multiple Images
     */
    //Upload Files
    'click .photoUpload': function () {
        $("[name='uploadPhoto']").click();
    },
    'change .tab-pane.active [name="uploadPhoto"]': function () {
        var files = $('.tab-pane.active [name="uploadPhoto"]')[0].files;
        if (files.length) {
            var file = files[0];
            FileList.push(file);
            var url = window.URL.createObjectURL(file);
            $(".multiPreview").append('<div class="previewer"><img id="image" class="img-preview preview-lg" src="' + url + '"><a href="#" class="remove-file"><i class="fa fa-times"></i> Remove</a><input id="fileNamePreview" type="text" class="hidden" value="' + file.name + '"></div>');
        }
    },
    // Using url
    'change .tab-pane.active [name="photoLink"]': function () {
        var photoLink = $('.tab-pane.active [name="photoLink"]').val();
        if (photoLink !== null && typeof photoLink !== "undfined") {

            //Check if Url is image
            if (/^http:\/\/.+\.(gif|png|jpg|jpeg)$/i.test(photoLink)) {
                multiPhotoLinks.push(photoLink);
                $(".multiPreview").append('<div class="previewer"><img id="image" class="img-preview preview-lg" src="' + photoLink + '"><a href="#" class="remove-file-link"><i class="fa fa-times"></i> Remove</a><input id="photoPreviewer" type="text" class="hidden" value="' + photoLink + '"></div>');

                //Reset input after insert url
                $('[name="photoLink"]').val("");
            } else {
                throw "Invalid Link"
            }
        }
    },

    /**
     * Removing image
     * @param e
     * @param tmp
     */
    //Remove multiple File
    'click .remove-file': function (e, tmp) {
        $(e.target).parent().remove();
        if (FileList.length) {
            file = _.find(FileList, function (obj) {
                return obj.name === $(e.target).parent().find("input").val()
            });
            var fileIndex = FileList.indexOf(file);
            FileList.splice(fileIndex, 1);
        }
        if (FileList.length === 0) {
            $('[name="uploadPhoto"]')[0].value = "";
        }
    },
    //Remove multiple url
    'click .remove-file-link': function (e, tmp) {
        $(e.target).parent().remove();
        var url = $("#photoPreviewer").val();
        if (multiPhotoLinks.length) {
            var urlIndex = multiPhotoLinks.indexOf(url);
            multiPhotoLinks.splice(urlIndex, 1);
        }
        if (multiPhotoLinks.length === 0)
            $("#photoPreviewer").val("");
    },

    /**
     * Upload Media Files
     */
    'click .tab-pane.active .mediaUpload': function () {
        $('.tab-pane.active [name="mediaUpload"]').click();
    },
    'change .tab-pane.active [name="mediaUpload"]': function () {
        var $currentTab = $(".tab-pane.active");
        var files = $currentTab.children().find('[name="mediaUpload"]')[0].files;
        if (files.length) {
            var file = files[0];
            if ($('#video').hasClass('active')) {
                videoFiles = file;
                var url = window.URL.createObjectURL(videoFiles);
                $currentTab.find('.mediaPreview').append('<div class="mediaPreviewer"><video width="320" height="240" controls> <source src="' + url + '" type="video/mp4"> Your browser does not support the video tag.</video><a href="#" class="remove-file-media"><i class="fa fa-times"></i> Remove</a></div>');
            } else if ($("#audio").hasClass('active')) {
                audioFile = file;
                var url = window.URL.createObjectURL(audioFile);
                $currentTab.find(".mediaPreview").append('<div class="mediaPreviewer"><audio controls><source src="' + url + '" type="audio/mpeg">Your browser does not support the audio element.</audio><a href="#" class="remove-file-media"><i class="fa fa-times"></i> Remove</a></div>');
            }
            $currentTab.find("div.upload-media").hide();
        }
    },

    /**
     * Media Url
     */
    'change .tab-pane.active [name="mediaLink"]': function () {
        var $currentTab = $(".tab-pane.active");
        if ($('#video').hasClass('active')) {
            var video = $currentTab.find('[name="mediaLink"]').val();
            videoLink = video;
            $currentTab.find('.mediaPreview').append('<div class="mediaPreviewer"><video width="320" height="240" controls> <source src="' + video + '" type="video/mp4"> Your browser does not support the video tag.</video><a href="#" class="remove-file-media"><i class="fa fa-times"></i> Remove</a></div>');
            $currentTab.find("div.upload-media").hide();
        } else if ($("#audio").hasClass('active')) {
            var audio = $currentTab.find('[name="mediaLink"]').val();
            audioLink = audio;
            $currentTab.find(".mediaPreview").append('<div class="mediaPreviewer"><audio controls><source src="' + audio + '" type="audio/mpeg">Your browser does not support the audio element.</audio><a href="#" class="remove-file-media"><i class="fa fa-times"></i> Remove</a></div>');
            $currentTab.find("div.upload-media").hide();
        }
    },

    /**
     * Delete Media File
     */
    'click .tab-pane.active .remove-file-media': function (e, tmp) {
        var $currentTab = $(".tab-pane.active");
        if ($('#video').hasClass('active')) {
            videoFiles = null;
            $(e.target).parent().remove();
            $currentTab.children().find('[name="mediaUpload"]')[0].value = "";
            $currentTab.find('[name="mediaLink"]').val("");
            $currentTab.find("div.upload-media").show();
        } else if ($("#audio").hasClass('active')) {
            audioFile = null;
            $(e.target).parent().remove();
            $currentTab.children().find('[name="mediaUpload"]')[0].value = "";
            $currentTab.find('[name="mediaLink"]').val("");
            $currentTab.find("div.upload-media").show();
        }
    },

    /**
     * Submit Post
     */
    'click .button-submit': function (e, tmp) {
        var $currentTab = $(".tab-pane.active");
        var title = $currentTab.find('[name="title"]').val();
        var summary = $currentTab.find('[name="summary"]').val();
        var tags = _.map($(".tab-pane.active .select2-selection__choice"), function (tag) {
            return tag.title
        });
        //Upsert Tags
        Meteor.call("upsertTags", tags);
        var channel = $(".tab-pane.active .channel").find('span').text();
        var status;
        if ($(e.target).text() === "Save as Draft") {
            status = "Draft";
        } else {
            status = $(_.last($(".tab-pane.active .select-custom-header"))).find('span').text();
        }
        var owner = Meteor.userId();
        if (title === "" || typeof title === "undefined") {
            alert("Insert Field");
            return;
        }
        if (summary === "" || typeof summary === "undefined") {
            alert("Insert Field");
            return;
        }
        if (tags === "" || typeof tags === "undefined") {
            alert("Insert Field");
            return;
        }
        var insertItems = {
            title: title,
            summary: summary,
            tags: tags,
            channel: channel,
            contentUpload: contentUpload,
            status: status,
            owner: owner,
            createdAt: new Date()
        };
        if ($("#reporting").hasClass("active")) {
            var thumbLink = Session.get('thumbLink');
            var content = tinyMCE.get('editor').getContent();
            if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                $('button').attr('disabled', true);
                _.extend(insertItems, {
                    image: thumbLink,
                    type: "Reporting",
                    content: content,
                    contentUpload: contentUpload
                });
                Meteor.call('postInsert', insertItems, function (err) {
                    if (!err) {
                        resetAll();
                        $('button').removeAttr('disabled');
                        $('#post').modal('hide');
                    }
                });
            } else if (img !== null && typeof img !== "undefined") {
                $('button').attr('disabled', true);
                croppedImage(Upload, function () {
                    _.extend(insertItems, {
                        image: {
                            large: {relative_url: largeImg.key},
                            medium: {relative_url: mediumImg.key},
                            small: {relative_url: smallImg.key},
                            square: {relative_url: squareImg.key}
                        },
                        content: content,
                        contentUpload: contentUpload,
                        type: "Reporting"
                    });
                    Meteor.call('postInsert', insertItems, function (err) {
                        if (!err) {
                            resetAll();
                            $('button').removeAttr('disabled');
                            $('#post').modal('hide');
                        }
                    });
                })
            } else {
                alert("Insert Field");
            }
        } else if ($('#link').hasClass('active')) {
            var url = $('[name="addLink"]').val();
            if (url !== "" && url !== null && typeof url !== "undefined") {
                $('button').attr('disabled', true);
                var thumbLink = Session.get('thumbLink');
                if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                    _.extend(insertItems, {image: thumbLink, url: url, type: 'Link'});
                    Meteor.call('postInsert', insertItems, function (err) {
                        if (!err) {
                            resetAll();
                            $('button').removeAttr('disabled');
                            $('#post').modal('hide');
                        }
                    });
                } else if (img !== null && typeof img !== "undefined") {
                    croppedImage(Upload, function () {
                        _.extend(insertItems, {
                            image: {
                                large: {relative_url: largeImg.key},
                                medium: {relative_url: mediumImg.key},
                                small: {relative_url: smallImg.key},
                                square: {relative_url: squareImg.key}
                            },
                            url: url,
                            type: 'Link'
                        });
                        Meteor.call('postInsert', insertItems, function (err) {
                            if (!err) {
                                resetAll();
                                $('button').removeAttr('disabled');
                                $('#post').modal('hide');
                            }
                        });
                    })
                } else {
                    alert("Insert Field");
                }
            } else {
                alert("Insert Field");
            }
        } else if ($('#photo').hasClass('active')) {
            if (FileList.length) {
                $('button').attr('disabled', true);
                var thumbLink = Session.get('thumbLink');
                var photoList = [], count = 0;
                if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                    _.extend(insertItems, {image: thumbLink, type: 'Link'});
                } else if (img !== null && typeof img !== "undefined") {
                    croppedImage(Upload, function () {
                        _.extend(insertItems, {
                            image: {
                                large: {relative_url: largeImg.key},
                                medium: {relative_url: mediumImg.key},
                                small: {relative_url: smallImg.key},
                                square: {relative_url: squareImg.key}
                            },
                            type: 'Photos'
                        });
                    })
                } else {
                    alert("Insert Field");
                }
                S3.upload({
                    files: FileList,
                    path: 'tester/original',
                    unique_name: false
                }, function (err, result) {
                    photoList.push(result.relative_url);
                    if (count === (FileList.concat(multiPhotoLinks)).length - 1) {
                        _.extend(insertItems, {multiImage: photoList.concat(multiPhotoLinks)});
                        Meteor.call('postInsert', insertItems, function (err) {
                            if (!err) {
                                resetAll();
                                $('button').removeAttr('disabled');
                                $('#post').modal('hide');
                            }
                        });
                    } else count++;
                })
            } else {
                alert("Insert Field");
            }
        } else if ($('#video').hasClass('active')) {
            if (videoFiles !== null && typeof videoFiles !== "undefined") {
                $('button').attr('disabled', true);
                var thumbLink = Session.get('thumbLink');
                var video;
                S3.upload({
                    files: [videoFiles],
                    path: 'tester/video',
                    unique_name: false
                }, function (err, result) {
                    if (err) throw err.reason;
                    else {
                        video = result.relative_url;
                        if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                            _.extend(insertItems, {image: thumbLink, video: video, type: "Video"});
                            Meteor.call('postInsert', insertItems, function (err) {
                                if (!err) {
                                    resetAll();
                                    $('button').removeAttr('disabled');
                                    $('#post').modal('hide');
                                }
                            });
                        } else if (img !== null && typeof img !== "undefined") {
                            croppedImage(Upload, function () {
                                _.extend(insertItems, {
                                    image: {
                                        large: {relative_url: largeImg.key},
                                        medium: {relative_url: mediumImg.key},
                                        small: {relative_url: smallImg.key},
                                        square: {relative_url: squareImg.key}
                                    },
                                    video: video,
                                    type: "Video"
                                });
                                Meteor.call('postInsert', insertItems, function (err) {
                                    if (!err) {
                                        resetAll();
                                        $('button').removeAttr('disabled');
                                        $('#post').modal('hide');
                                    }
                                });
                            })
                        } else {
                            alert("Insert Field");
                        }
                    }
                })
            } else if (videoLink !== null && typeof videoLink !== "undefined") {
                if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                    var thumbLink = Session.get('thumbLink');
                    _.extend(insertItems, {image: thumbLink, video: videoLink, type: "Video"});
                    Meteor.call('postInsert', insertItems, function (err) {
                        if (!err) {
                            resetAll();
                            $('button').removeAttr('disabled');
                            $('#post').modal('hide');
                        }
                    });
                } else if (img !== null && typeof img !== "undefined") {
                    croppedImage(Upload, function () {
                        _.extend(insertItems, {
                            image: {
                                large: {relative_url: largeImg.key},
                                medium: {relative_url: mediumImg.key},
                                small: {relative_url: smallImg.key},
                                square: {relative_url: squareImg.key}
                            },
                            video: videoLink,
                            type: "Video"
                        });
                        Meteor.call('postInsert', insertItems, function (err) {
                            if (!err) {
                                resetAll();
                                $('button').removeAttr('disabled');
                                $('#post').modal('hide');
                            }
                        });
                    })
                } else {
                    alert("Insert Field");
                }

            } else {
                alert("Insert Field");
            }
        }
        else if ($('#audio').hasClass('active')) {
            if (audioFile !== null && typeof audioFile !== "undefined") {
                $('button').attr('disabled', true);
                var thumbLink = Session.get('thumbLink');
                var audio;
                S3.upload({
                    files: [audioFile],
                    path: 'tester/audio',
                    unique_name: false
                }, function (err, result) {
                    if (err) throw err.reason;
                    else {
                        audio = result.relative_url;
                        if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                            _.extend(insertItems, {image: thumbLink, audio: audio, type: "Audio"});
                            Meteor.call('postInsert', insertItems, function (err) {
                                if (!err) {
                                    resetAll();
                                    $('button').removeAttr('disabled');
                                    $('#post').modal('hide');
                                }
                            });
                        } else if (img !== null && typeof img !== "undefined") {
                            croppedImage(Upload, function () {
                                _.extend(insertItems, {
                                    image: {
                                        large: {relative_url: largeImg.key},
                                        medium: {relative_url: mediumImg.key},
                                        small: {relative_url: smallImg.key},
                                        square: {relative_url: squareImg.key}
                                    },
                                    audio: audio,
                                    type: "Audio"
                                });
                                Meteor.call('postInsert', insertItems, function (err) {
                                    if (!err) {
                                        resetAll();
                                        $('button').removeAttr('disabled');
                                        $('#post').modal('hide');
                                    }
                                });
                            })
                        } else {
                            alert("Insert Field");
                        }
                    }
                })
            } else if (audioLink !== null && typeof audioLink !== "undefined") {
                if (thumbLink !== null && typeof thumbLink !== 'undefined') {
                    _.extend(insertItems, {image: thumbLink, audio: audioLink, type: "Audio"});
                    Meteor.call('postInsert', insertItems, function (err) {
                        if (!err) {
                            resetAll();
                            $('button').removeAttr('disabled');
                            $('#post').modal('hide');
                        }
                    });
                } else if (img !== null && typeof img !== "undefined") {
                    croppedImage(Upload, function () {
                        _.extend(insertItems, {
                            image: {
                                large: {relative_url: largeImg.key},
                                medium: {relative_url: mediumImg.key},
                                small: {relative_url: smallImg.key},
                                square: {relative_url: squareImg.key}
                            },
                            audio: audioLink,
                            type: "Audio"
                        });
                        Meteor.call('postInsert', insertItems, function (err) {
                            if (!err) {
                                resetAll();
                                $('button').removeAttr('disabled');
                                $('#post').modal('hide');
                            }
                        });
                    })
                } else {
                    alert("Insert Field");
                }
            } else {
                alert("Insert Field");
            }
        }
    }
});