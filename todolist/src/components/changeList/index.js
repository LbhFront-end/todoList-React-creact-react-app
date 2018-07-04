import React, { Component } from 'react';
import { BackAdd, Title, Content, Time } from '../addList/index'
import PropTypes from "prop-types";
import { Toast, Modal } from 'antd-mobile'
import './index.css'

//现时间
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// 对话框
const alert = Modal.alert;
//生成时间id
function produceId() {
    return Math.random().toString(16);
}
//   js each模仿jq each
function each(object, callback) {
    var type = (function () {
        switch (object) {
            case Object:
                return "Object";
            case Array:
                return "Array";
            case NodeList:
                return "NodeList";
            default:
                return "null";
        }
    })();
    // 为数组或类数组时, 返回: index, value
    if (type === "Array" || type === "NodeList") {
        // 由于存在类数组NodeList, 所以不能直接调用every方法
        [].every.call(object, function (v, i) {
            return callback.call(v, i, v) === false ? false : true;
        });
    } else if (type === "Object") {
        // 为对象格式时,返回:key, value
        for (var i in object) {
            if (callback.call(object[i], i, object[i]) === false) {
                break;
            }
        }
    }
}
class ChangeList extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            title: '',
            textarea: '',
            count: 0,
            date: 0,
            name: '更新',
            status: 0
        }
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.ChangeListStatus = this.ChangeListStatus.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.finishItem = this.finishItem.bind(this);
    }
    componentWillMount() {
        this.getData();
    }
    // 获取数据
    getData() {
        let self = this;
        var getList = localStorage.getItem("List");
        self.oldList = JSON.parse(getList);
        self.oldId = self.props.match.params.id;
        each(self.oldList, function (i, v) {
            if (v.id == self.oldId) {
                self.setState({ title: v.title, textarea: v.content, date: new Date(v.time), count: v.content.length });
            }
        })
    }
    // title改变
    onTitleChange(event) {
        this.setState({ title: event.target.value, });
    }
    // textArea改变
    onTextAreaChange(event) {
        this.setState({ textarea: event.target.value, count: event.target.value.length });
    }
    //时间改变
    onTimeChange(event) {
        this.setState({ date: event });
    }
    // 改变状态
    ChangeListStatus() {
        let self = this;
        var getList = localStorage.getItem("List");
        var oldList = JSON.parse(getList);
        // 判断标题内容时间
        if (!self.state.title) {
            Toast.info('标题不可以为空', 2);
            return false;
        } else if (!self.state.textarea) {
            Toast.info('内容不可以为空', 2);
            return false;
        } else if (!((now - self.state.date) < 0)) {
            Toast.info('不可以选择过去的时间', 2);
            return false;
        } else {
            const id = produceId();
            const { title, textarea, date } = this.state;
            // 新备忘录
            each(oldList, function (i, v) {
                if (v.id == self.props.match.params.id) {
                    v.title = title;
                    v.content = textarea;
                    v.id = id;
                    v.time = date;
                    v.status = 0;
                }
            });
            var a = JSON.stringify(oldList);
            localStorage.setItem("List", a);
            Toast.info('更改状态成功', 1.5);
            this.context.router.history.push(`/`);
        }
    }

    //删除备忘录
    deleteItem() {
        var getList = localStorage.getItem("List");
        var List = JSON.parse(getList);
        localStorage.removeItem("List");
        List = List.filter(item => item.id !== this.props.match.params.id);
        var a = JSON.stringify(List);
        localStorage.setItem("List", a);
        Toast.info('删除成功', 1.5);
        this.context.router.history.push(`/`);
    }
    //完成备忘录
    finishItem() {
        console.log(1);
        var getList = localStorage.getItem("List");
        var List = JSON.parse(getList);
        const oldId = this.props.match.params.id;
        each(List, function (i, v) {
            if (v.id == oldId) {
                v.status = 1;
            }
        });
        var a = JSON.stringify(List);
        localStorage.setItem("List", a);
        Toast.info('任务已完成', 1.5);
        this.context.router.history.push(`/`);
    }
    render() {
        const { title, textarea, count, date, name } = this.state;
        return (
            <div className="changeList flex-col flex-x-center flex-y-center">
                {/* 头部 */}
                <BackAdd onClick={this.ChangeListStatus} name={name} />
                {/* 标题 */}
                <Title value={title} onChange={this.onTitleChange} />
                {/* 内容 */}
                <Content value={textarea} onChange={this.onTextAreaChange} count={count} />
                {/* 时间 */}
                <Time value={date} onChange={this.onTimeChange} />
                {/* 底部功能键 */}
                <BottomFunction deleteItem={this.deleteItem} finishItem={this.finishItem} />
            </div>
        )
    }
}

// 底部功能键
const BottomFunction = ({ deleteItem, finishItem }) => <div className="bottomFunction flex-row flex-space-between flex-y-center">
    <div className="f1" onClick={() =>
        alert('此操作会删除此条备忘录', '您确定吗???', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '删除', onPress: () => deleteItem() },
        ])}>
        <img src={require('../../images/c-delete .png')} />
    </div>
    <div className="f2" onClick={finishItem}>
        <img src={require('../../images/finish.png')}/>
    </div>
</div>
export default ChangeList;
