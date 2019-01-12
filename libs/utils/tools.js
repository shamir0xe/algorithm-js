class StopWatch {
    start = () => {
        this.timer = new Date().getTime();
    };

    getTime = () => {
        return new Date().getTime() - this.timer;
    };

    timeStamp = () => {
        console.log('time elapsed: ' + this.getTime());
    };

    constructor() {
        this.timer = new Date().getTime();
    }
}

class DeepCopy {
    static copy = (obj) => {
        return JSON.parse(JSON.stringify(obj));
    }
}

class SearchLocation {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.autoCompleteUrl = "https://maps.googleapis.com/maps/api/place/autoComplete/json?";
        this.searchLocation = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";
    }

    query = (type, text) => {
        if (type === 'autoComplete') return this.autoComplete(text);
        if (type === 'findCoordinates') return this.findCoordinates(text);
    };

    findCoordinates(text) {
        text = encodeURIComponent(text.trim());
        let url = this.searchLocation;
        url += "input=" + text;
        url += "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry";
        url += "&key=" + this.apiKey;

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                new NestedPrinter().print(json);
                return Promise.resolve(json);
            })
            .catch(error => {
                new NestedPrinter().print(error);
                return Promise.reject(error);
            });
    };

    autoComplete(text) {
        text = encodeURIComponent(text.trim());
        let url = this.autoCompleteUrl;

        // &key=YOUR_API_KEY
        url += "input=" + text;
        // url += "&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry";
        url += "&key=" + this.apiKey;

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                new NestedPrinter().print(json);
                return Promise.resolve(json);
            })
            .catch(error => {
                new NestedPrinter().print(error);
                return Promise.reject(error);
            });
    }
}

class StringRandomGenerator {
    static alphaNumericalRandomGenerator = (count) => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < count; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        // console.log('random:' + text);
        return text;
    }
}

class Queue {
    isEmpty = () => {
        return this.list.length === 0;
    };
    clear = () => {
        this.list = [];
    };
    pushBack = (item) => {
        this.list.push(item);
    };
    length = () => {
        return this.list.length;
    };
    popBack = () => {
        return this.list.pop();
    };
    pop = () => {
        return this.list.shift();
    };
    front = () => {
        return this.list[0];
    };
    pushFront = (item) => {
        this.list.unshift(item);
    };
    pushSecondFront = (item) => {
        if (this.length() > 0) {
            this.list.splice(1, 0, item);
        } else {
            this.pushBack(item);
        }
    };
    getItem = (index) => {
        if (index < this.list.length)
            return this.list[index];
        else
            return null;
    };

    constructor() {
        this.list = [];
    }
}

class NestedPrinter {
    addTabs = (level) => {
        for (let i = 0; i < level; ++i) {
            this.buffer += '=';
        }
    };
    addToBuffer = (str) => {
        str = str.toString();
        this.buffer += str;
    };
    flushBuffer = () => {
        console.log(this.buffer);
        this.buffer = "";
    };
    print = (object, level = 1) => {
        if (level > 10) return;
        // console.log('++' + typeof (object));
        if (typeof (object) === "string" || typeof (object) === "boolean" || typeof (object) === "number" || typeof (object) === "undefined") {
            this.addTabs(level);
            this.addToBuffer(' ' + object);
            this.flushBuffer();
            return;
        }
        for (let key in object) {
            this.addTabs(level);
            this.addToBuffer(' [' + key + ']');
            this.flushBuffer();
            this.print(object[key], level + 1);
        }
    };

    constructor() {
        this.buffer = "";
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    };
}


module.exports = {
    StopWatch,
    NestedPrinter,
    StringRandomGenerator,
    SearchLocation,
    Queue,
    DeepCopy
};

