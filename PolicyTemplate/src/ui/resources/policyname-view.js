function PolicyConfigurationModel(ko, $, oj, config, additionalParams) {
	
    self = this;
    self.config = config;
    self.l10n = ko.observable(additionalParams.l10nbundle);
    self.conditions = ko.observableArray();
    self.script = ko.observable();
    
    self.initialize = function() {
    	
        if (self.config) {
        	
            self.script(self.config.script);
            
        }
        
    };

    self.initialize();
    
}