const HighResolutionTimer = function(options) {
  this.timer = false;

  this.total_ticks = 0;

  this.start_time = undefined;
  this.current_time = undefined;

  this.bpm = 60000 / ((options.bpm) ? options.bpm : 1000);
  this.callback = (options.callback) ? options.callback : function() {};

  this.run = function() {
    this.current_time = Date.now();
    if (!this.start_time) { this.start_time = this.current_time; }

    this.callback(this);

    var nextTick = this.bpm - (this.current_time - (this.start_time + (this.total_ticks * this.bpm) ) );
    this.total_ticks++;

    (function(i) {
      i.timer = setTimeout(function() {
        i.run();
      }, nextTick);
    }(this));

    return this;
  };

  this.stop = function(){
    clearTimeout(this.timer);
    return this;
  };

  return this;
};

export default HighResolutionTimer;
