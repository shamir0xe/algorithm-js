/**
 * Created by shamir14 on 4/24/14.
 */
import {StringRandomGenerator} from '../utils/tools';

class Node {
    constructor(value, prior = null) {
        this.val = value;
        this.height = 1;
        this.size = 1;
        this.par = this.left = this.right = null;
        this.hash = StringRandomGenerator.alphaNumericalRandomGenerator(11);
        if (prior) this.prior = prior;
    }

    getValue = () => {
        return this.val;
    };

    setValue = (value) => {
        this.val = value;
    };

    toString = () => {
        return {
            value: this.val,
            parent: this.par ? this.par.getValue() : "NONE",
            size: this.size,
            height: this.height,
            hash: this.hash
        };
    };

    isEqual = (node) => {
        try {
            if (this.value === node.getValue()) return this.hash === node.hash;
        } catch (err) {
            return false;
        }
        return false;
    };

    getSize = (node) => {
        return node ? node.size : 0;
    };
}

module.exports = {
    Node
};
