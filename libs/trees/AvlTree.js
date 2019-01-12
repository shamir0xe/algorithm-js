/**
 * Created by shamir14 on 4/23/14.
 */

import {Node} from './Node';
import {NestedPrinter} from '../utils/tools';

let cmpFunction = (a, b) => {
    return a < b ? -1 : a > b ? +1 : 0;
};

class AvlTree {
    constructor(rootValue = null) {
        if (rootValue) this.root = new Node(rootValue);
        else this.root = new Node(null);

        this.cmp = cmpFunction;
    }

    totalChildren = () => {
        if (this.root) return this.root.size;
        return 0;
    };

    getRoot = () => {
        return this.root;
    };

    setCmpFunction = (func) => {
        this.cmp = func;
    };

    setRoot = (root) => {
        this.root = root;
    };

    getHeight = (node) => {
        return node ? node.height : 0;
    };

    /**
     *
     * @param node
     * @returns {number} indicates the difference between left and right heights
     */
    getBalance = (node) => {
        if (!node) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    };

    _rotateRight = (y) => {
        // console.log('before right rotation');
        // let array = [];
        // this.inOrder(y, array);
        // console.log(array.join(''));


        let x = y.left;
        let T2 = x.right;

        x.right = y;
        y.left = T2;

        // Update heights
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;


        // console.log('right rotation');
        // array = [];
        // this.inOrder(x, array);
        // console.log(array.join(''));

        // Return new root
        return x;
    };

    _rotateLeft = (x) => {
        // console.log('before left rotation');
        // let array = [];
        // this.inOrder(x, array);
        // console.log(array.join(''));

        let y = x.right;
        let T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        //  Update heights
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        // console.log('left rotation');
        // array = [];
        // this.inOrder(y, array);
        // console.log(array.join(''));
        // new NestedPrinter().print(array);
        // Return new root
        return y;
    };

    _remove = (target, node = this.root) => {
        if (!target) return null;
        if (!node) return null;
        let compare = this.cmp(target.getValue(), node.getValue());
        if (compare === 0) {
            if (node.right) {
                node.setValue(node.right.getValue());
                let right = this._remove(node.right, node.right);
                if (right) right.par = node;
                node.right = right;
            } else {
                if (node.left) {
                    node.setValue(node.left.getValue());
                    let left = this._remove(node.left, node.left);
                    if (left) left.par = node;
                    node.left = left;
                } else {
                    return null;
                }
            }
        }
        if (compare < 0) {
            let left = this._remove(target, node.left);
            if (left) left.par = node;
            node.left = left;
        }
        if (compare > 0) {
            let right = this._remove(target, node.right);
            if (right) right.par = node;
            node.right = right;
        }
        return this._relax(node);
    };

    /**
     * remove the node
     * @param target: the target node to be removed
     */
    remove = (target) => {
        if (target === null) return;
        this.root = this._remove(target);
        if (this.root === null) this.root = new Node(null);
    };

    /**
     * return the node specified to the value
     * @param value
     * @param node
     * @returns {*}
     */
    find = (value, node = this.root) => {
        if (!node) return null;
        let compare = this.cmp(value, node.getValue());
        if (compare === 0) return node;
        if (compare < 0) return this.find(value, node.left);
        if (compare > 0) return this.find(value, node.right);
    };

    _relax = (node) => {
        if (!node) return null;
        node.size = this.getSize(node.left) + this.getSize(node.right) + 1;
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
        // if (insertedKey === null) return null;

        let balance = this.getBalance(node);
        if (balance > 1) {
            if (this.getHeight(node.left.left) > this.getHeight(node.left.right)) {
                return this._rotateRight(node);
            } else {
                node.left = this._rotateLeft(node.left);
                return this._rotateRight(node);
            }

            // if (this.cmp(node.left.getValue(), insertedKey) > 0) {
            //     return this._rotateRight(node);
            // } else {
            //     node.left = this._rotateLeft(node.left);
            //     return this._rotateRight(node);
            // }
        } else if (balance < -1) {
            if (this.getHeight(node.right.right) > this.getHeight(node.right.left)) {
                return this._rotateLeft(node);
            } else {
                node.right = this._rotateRight(node.right);
                return this._rotateLeft(node);
            }
            // if (this.cmp(insertedKey, node.right.getValue()) > 0) {
            //     return this._rotateLeft(node);
            // } else {
            //     node.right = this._rotateRight(node.right);
            //     return this._rotateLeft(node);
            // }
        }
        return node;
    };

    _add = (cur, node) => {
        if(this.cmp(node.getValue(), cur.getValue()) < 0) {
            if(!cur.left) {
                cur.left = node;
                node.par = cur;
            } else {
                let left = this._add(cur.left, node);
                left.par = cur;
                cur.left = left;
            }
        } else {
            if(!cur.right) {
                cur.right = node;
                node.par = cur;
            } else {
                let right = this._add(cur.right, node);
                right.par = cur;
                cur.right = right;
            }
        }
        // return this._relax(cur, node.getValue());
        return this._relax(cur);
    };

    insert = (value) => {
        if (this.root.getValue() === null) this.root.setValue(value);
        else this.root = this._add(this.root, new Node(value));
    };

    toString = () => {
        let array = [];
        this.inOrder(this.root, array);
        return array.join('');
    };

    inOrder = (node, inOrderList) => {
        if(!node)
            return ;
        inOrderList.push("(");
        this.inOrder(node.left, inOrderList);
        inOrderList.push(",");
        if (node && node.getValue()) inOrderList.push(node.getValue().toString());
        inOrderList.push(",");
        this.inOrder(node.right, inOrderList);
        inOrderList.push(")");
    };

    getFirst = (node = this.root) => {
        if (!node) return null;
        while (node.left !== null) node = node.left;
        return node;
    };

    getEntries = (list = [], node = this.root) => {
        if (!node) return ;
        this.getEntries(list, node.left);
        list.push(node);
        this.getEntries(list, node.right);
    };

    getSize = (node) => {
        return !node ? 0 : node.size;
    };

    merge = (left, right) => {
        if(!left)
            return right;
        if(!right)
            return left;
        let ret;
        if(left.height < right.height) {
            left.right = this.merge(left.right, right);
            if(left.right !== null) {
                left.right.par = left;
            }
            ret = left;
        } else {
            right.left = this.merge(left, right.left);
            if(right.left !== null) {
                right.left.par = right;
            }
            ret = right;
        }
        this._relax(ret);
        ret.par = null;
        return ret;
    };

    pollInd = (ind, cur) => {
        if(cur === null)
            return null;
        let szLeft = this.getSize(cur.left);
        if(szLeft === ind) {
            let temp = this.merge(cur.left, cur.right);
            if(temp !== null)
                temp.par = cur.par;
            if(cur.par !== null) {
                if(cur.par.left === cur) {
                    cur.par.left = temp;
                } else {
                    cur.par.right = temp;
                }
            } else {
                this.root = temp;
            }
            return cur;
        }
        let ret;
        if(szLeft > ind) {
            ret = this.pollInd(ind, cur.left);
        }
        else {
            ret = this.pollInd(ind - szLeft - 1, cur.right);
        }
        this._relax(cur);
        return ret;
    };

}


module.exports = {
    AvlTree
};