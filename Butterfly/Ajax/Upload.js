/**
 *
 * Class to do ajax uploads with Butterfly
 *
 */

Butterfly.Ajax.Upload = function(options)
{
    //functions
    this.startUpload = function()
    {
        this.cleanLog();

        this.loading.style.display = 'inline';

        var preupload = true;
        if (options.preupload) {
            options.preupload();
        }

        if (preupload != false) {
            this.progressbar.updateProgress(0);
            var count = this.upload.files.length;
            var params = [];
            var nbInputs = this.inputs.length;
            for (var i = 0 ; i < nbInputs ; i ++) {
                params.push(this.inputs[i].name + '=' + escape(this.inputs[i].value));
            }
            params = params.join('&');
            params = params + (params != '' ? '&' : '');

            for (var i = 0 ; i < count ; i ++) {
                this.current.innerHTML = this.upload.files[i].name;
                xhr = Butterfly.Ajax.request(
                    options.action == '' ? document.location.pathname : options.action,
                    {},
                    {},
                    'POST',
                    params + '&ajax=1&file=' + this.upload.files[i].getAsDataURL() + '&filename=' + this.upload.files[i].name,
                    {
                        async: false
                    }
                );
                if (xhr.status != 200 || xhr.responseText != '') {
                    this.logText(xhr.responseText);
                }
                this.progressbar.updateProgress((i + 1) * 100 / count);
            }

            if (options.endupload) {
                options.endupload();
            }

            this.current.innerHTML = '';
            this.loading.style.display = 'none';
        }
    };

    this.cleanLog = function()
    {
        this.logDiv.innerHTML = '';
    }

    this.logText = function(text, append)
    {
        if (append) {
            this.logDiv.innerHTML += '<br/>' + text;
        }
        else {
            this.logDiv.innerHTML = text;
        }
    }

    //constructor
    var form = Butterfly.create(
        'form',
        {
            'action': options.action,
            'method': 'post',
            'enctype': 'multipart/form-data',
            'onsubmit': this.startUpload
        }
    );

    this.upload = Butterfly.create(
        'input',
        {
            'type': 'file',
            'name': 'upload'
        },
        form
    );

    if (this.upload.files) {
        this.upload.setAttribute('multiple', 'multiple');
        var buttonType = 'button';
    }
    else {
        var buttonType = 'submit';
    }

    var nbInputs = options.inputs.length;
    this.inputs = [];
    for (var i = 0 ; i < nbInputs ; i ++) {
        if ($id(options.inputs[i])) {
            this.inputs.push($id(options.inputs[i]));
            form.appendChild($id(options.inputs[i]));
            if (this.inputs[this.inputs.length - 1].type != 'hidden') {
                Butterfly.create('br', {}, form);
            }
        }
    }

    var uploadButton = Butterfly.create(
        'input',
        {
            'type': buttonType,
            'name': 'upload-button',
            'value': 'Envoyer'
        },
        form
    );

    if (this.upload.files) {
        Butterfly.addEvent(uploadButton, 'click', this.startUpload, {'scope': this});
    }

    this.progressbar = new Butterfly.ProgressBar(form);
    this.loading = Butterfly.create('img', {'src': '/images/ajax-loader.gif', 'alt': 'loading...'}, form);
    this.loading.style.display = 'none';
    this.current = Butterfly.create('span', {}, form);
    this.logDiv = Butterfly.create('div', {'class':'upload-log'}, form);

    if ($id(options.parent)) {
        $id(options.parent).appendChild(form);
    }
};
