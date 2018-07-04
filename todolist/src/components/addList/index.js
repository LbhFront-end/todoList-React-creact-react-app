import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from "prop-types";
import { DatePicker, List, Toast } from 'antd-mobile'
import './index.css'

//现时间
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
//生成时间id
function produceId() {
    return Math.random().toString(16);
}
class AddList extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props,context) {
        super(props,context);
        this.state = {
            title: '',
            textarea: '',
            count: 0,
            date: now,
            name: '添加',
            status: 0
        }
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onTextAreaChange = this.onTextAreaChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.AddListItem = this.AddListItem.bind(this);
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
    //添加备忘录
    AddListItem() {
        let self = this;
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
            // 新备忘录
            const newDate = {
                id: id,
                title: self.state.title,
                content: self.state.textarea,
                time: self.state.date,
                status: self.state.status
            };
            //获取 旧localStorage
            let oldList = localStorage.getItem("List");
            var oldStorage = JSON.parse(oldList);
            // 判断旧localStorage有无数据进行操作
            if (oldStorage) {
                oldStorage.push(newDate);
                var a = JSON.stringify(oldStorage);
                localStorage.setItem("List", a);
                // console.log('1' + a);
                self.context.router.history.push(`/`);
            } else {
                var stroage = [];
                stroage.push(newDate);
                var a = JSON.stringify(stroage);
                localStorage.setItem("List", a);
                self.context.router.history.push(`/`);
            }
        }
    }
    render() {
        const { title, textarea, count, date,name } = this.state;
        return (
            <div className="addList flex-col flex-x-center flex-y-center">
                {/* 头部  */}
                <BackAdd onClick={this.AddListItem} name ={name} />
                {/* 标题  */}
                <Title value={title} onChange={this.onTitleChange} />
                {/* 内容 */}
                <Content value={textarea} onChange={this.onTextAreaChange} count={count} />
                {/* 时间 */}
                <Time value={date} onChange={this.onTimeChange} />
            </div>
        )
    }
}

// 头部
const BackAdd = ({ onClick,name }) => <div className="headPosition flex-row flex-space-between flex-y-center">
    {/* 左边icon与字  */}
    <div className="left flex-row flex-x-center flex-y-center">
        <div className="leftBack-icon flex-row flex-x-center flex-y-center">
            <Link to={`/`} className="flex-row flex-x-center flex-y-center">
                <img src={require('../../images/back.png')}/>
            </Link>
        </div>
        <div className="leftBack-text flex-row flex-x-center flex-y-center">
            <p>待办事件</p>
        </div>
    </div>
    {/* add添加 */}
    <div className="right flex-row flex-x-center flex-y-center">
        <p onClick={onClick}>{name}</p>
    </div>
</div>
// 标题
const Title = ({ onChange, value }) => <div className="textTitle flex-col flex-left flex-y-center">
    <div className="smallHead flex-col flex-left flex-y-center">
        <p>标题</p>
    </div>
    <div className="textTitle-input">
        <input type="text" value={value} onChange={onChange} placeholder="请输入您的所办事情的标题" />
    </div>
</div>
//内容
const Content = ({ onChange, value, count }) => <div className="textContent flex-col flex-left flex-y-center">
    <div className="smallHead flex-col flex-left flex-y-center">
        <p>内容</p>
    </div>
    <div className="textContent-input">
        <textarea value={value} maxLength="140" onChange={onChange} placeholder="请输入您的办事内容" />
        <p className="count">{count}/140</p>
    </div>
</div>

// 时间
const Time = ({ onChange, value }) => <div className="textTime flex-col flex-left flex-y-center">
    <div className="smallHead flex-col flex-left flex-y-center">
        <p>时间</p>
    </div>
    <List className="date-picker-list textTime-input flex-row flex-left flex-y-center">
        <div className="modal-input">
            <DatePicker
                value={value}
                onChange={onChange}
            >
                <List.Item arrow="horizontal"></List.Item>
            </DatePicker>
        </div>
    </List >
</div>

export {
    BackAdd,
    Title,
    Content,
    Time
}
export default AddList;