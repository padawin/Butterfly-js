Butterfly.ProgressBar = function(parent)
{
    this.progress = 0;

    this.updateProgress = function(value)
    {
        this.progress = value * Butterfly.getStyleValue(this.bar, 'width') / 100;
        this.refresh();
    };

    this.getProgress = function()
    {
        return this.progress * 100 / Butterfly.getStyleValue(this.bar, 'width');
    }

    this.refresh = function()
    {
        this.bar.children[0].style.width = this.progress + 'px';
    }

    this.bar = Butterfly.create('div', {'class': 'progress-bar'}, parent);
    Butterfly.create('div', {'class': 'bar', 'style': 'width=' + this.progress + 'px'}, this.bar);
};
