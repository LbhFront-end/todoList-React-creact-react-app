import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { sortBy } from 'lodash';
import { Modal, Toast } from 'antd-mobile'
import './index.css'
// 时间
const nowDate = new Date();
// 对话框
const alert = Modal.alert;
//时间格式化
function formatDate(item) {
    const date = new Date(item);
    var tomorrow = new Date(item);
    var yesterday = new Date(item);
    tomorrow.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    yesterday.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    //小于10 加 0
    const pad = n => n < 10 ? `0${n}` : n;
    var hours = date.getHours(); //小时
    var minutes = date.getMinutes(); //分
    // 得到hours
    const Hours = (day, hours) => hours = (hours < 12 ? (day + '早上') : ((hours > 12 && hours < 17) ? (day + '中午') : (day + '下午'))) + (hours < 12 ? pad(hours) : pad(hours - 12));
    if (nowDate.toDateString() === new Date(date).toDateString()) {
        return `${Hours('今天 ', hours)}:${pad(minutes)}`;
    } else if (
        new Date(tomorrow).toDateString() === new Date().toDateString()
    ) {
        return `${Hours('明天 ', hours)}:${pad(minutes)}`;
    } else if (
        new Date(yesterday).toDateString() === new Date().toDateString()
    ) {
        return `${Hours('昨天 ', hours)}:${pad(minutes)}`;
    } else {
        const dateStr = `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
        const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
        return `${dateStr} ${timeStr}`
    }
}
//排序
const SORTS = {
    Status: list => sortBy(list, 'status')
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsValue: '0',
            total: '',
            List: '',
            sortKey: 'Status'
        }
        this.onSelectChange = this.onSelectChange.bind(this);
        this.DeleteSingle = this.DeleteSingle.bind(this);
        this.onDeleteAll = this.onDeleteAll.bind(this);
    }
    //   js each模仿jq each
    each(object, callback) {
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
    // 多选框改变
    onSelectChange(event) {
        let getList = localStorage.getItem("List");
        var OldList = JSON.parse(getList);
        const tempList = OldList;
        const NewList = OldList;
        if (OldList.length == 0) {
            Toast.info('您还没有备忘录哦，去添加吧', 1.5);
        } else if (event.target.value == 0) {
            this.setState({ optionsValue: event.target.value, List: tempList });
        } else  if(event.target.value == 2){
            let newList = NewList.filter(item => item.status == 0);
            this.setState({ optionsValue: event.target.value, List: newList });
        }else{
            let newList = NewList.filter(item => item.status == 1);
            this.setState({ optionsValue: event.target.value, List: newList });
        }
    }
    //删除某个备忘录
    DeleteSingle(id) {
        const { List } = this.state;
        const updatedList = List.filter(item => item.id !== id);
        this.setState({ List: updatedList , total: updatedList.length});
        var a = JSON.stringify(updatedList);
        localStorage.setItem("List", a);
        Toast.info('删除成功', 1.5);
    }
    // 删除所有备忘录
    onDeleteAll() {
        localStorage.removeItem("List");
        this.setState({
            optionsValue: 0,
            total: 0,
            List: ''
        })
        Toast.info('清除成功', 1.5);
    }
    //判断state里面的时间是否过期
    getBorderClass() {
        let self = this;
        let getList = localStorage.getItem("List");
        var OldList = JSON.parse(getList);
        const length = OldList ? OldList.length : 0;
        self.each(OldList, function (i, v) {
            let oldDate = new Date(v.time);
            const judge = nowDate.getTime() - oldDate.getTime();
            if (v.status == 0) {
                if (judge > 0) {
                    v.status = 2;
                    // console.log(v.title + '序号：' + i);
                }
            }
        });
        this.setState({
            optionsValue: 0,
            total: length,
            List: OldList
        })
    }
    // 元素加载后加载数据
    componentDidMount() {
        this.getBorderClass();
    }
    render() {
        const { optionsValue, total, List, sortKey } = this.state;
        return (
            <div className="index flex-col flex-x-center flex-y-center">
                {/* 筛选 */}
                <Select value={optionsValue} onChange={this.onSelectChange} />
                {/* 标题 */}
                <Title />
                {/* 列表集 */}
                <Lists List={List} DeleteSingle={this.DeleteSingle} sortKey={sortKey} />
                {/* 底部功能键 */}
                <BottomFunction onClick={this.onDeleteAll} total={total} />
            </div >
        );
    }
}

// 筛选
const Select = ({ value, onChange }) => <div className="choice flex-space-between flex-y-center flex-row">
    <div className="flex-row flex-space-between flex-y-center">
        <select id="all" value={value} onChange={onChange}>
            <option value="0">全部</option>
            <option value="1">已完成</option>
            <option value="2">未完成</option>
        </select>
        <div className="icon-select flex-x-center flex-y-center flex-row">
            <label htmlFor="all flex-x-center flex-y-center flex-row">
                <img src={require('../../images/select.png')} alt=""/>
            </label>
        </div>
    </div>
    <div>
        <Link to={`/AddList`}>
            <p>添加</p>
        </Link>
    </div>
</div>
// 标题
const Title = ({ }) => <div className="title flex-left flex-col flex-y-center">
    <p>待办事件</p>
</div>
//列表集
const Lists = ({ List, DeleteSingle, sortKey }) => <div className="lists flex-col flex-x-center flex-y-center">
    {/* 单个列表 */}
    {
        List ? SORTS[sortKey](List).map(item =>
            //  列表Border
            <li className={"list-border flex-col flex-x-center flex-y-center " + (item.status == 0 ? '' : ((item.status == 1) ? 'finishT' : 'overT'))} key={item.id}>
                <div className="list flex-col flex-x-center flex-y-center">
                    {/* 主标题+时间  */}
                    <div className="titlesTime flex-row flex-space-between flex-y-center">
                        <div className="titles">
                            <p>{item.title}</p>
                        </div>
                        <div className="time">
                            <p>{formatDate(item.time)}</p>
                        </div>
                    </div>
                    {/* 主要内容  */}
                    <div className="content flex-row flex-space-between flex-y-center">
                        <div className="text">
                            <p>{item.content}</p>
                        </div>
                        <div className="edit-delect flex-row flex-space-between flex-y-center">
                            <div className="edit">
                                <Link to={`/ChangeList/${item.id}`}>
                                    <img src={require('../../images/add.png')}/>
                                </Link>
                            </div>
                            <div className="delect" onClick={() => alert('此操作会删除该条备忘录', '您确定吗???', [
                                { text: '取消', onPress: () => console.log('cancel') },
                                { text: '删除', onPress: () => DeleteSingle(item.id) },
                            ])}>
                                <img src={require('../../images/c-delete .png')} />
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        ) : <div className="tip flex-col flex-x-center flex-y-center">
                <p>您暂时还没有备忘录哦,快添加吧</p>
            </div>
    }
</div>
// 底部功能键
const BottomFunction = ({ total, onClick }) => <div className="bottomFunction flex-row flex-space-between flex-y-center">
    <div className="f1" onClick={() =>
        alert('此操作会删除所有备忘录', '您确定吗???', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '删除', onPress: () => onClick() },
        ])
    }>
        <img src={require('../../images/classify.png')} />
    </div>
    <div className="note">
        <p>总共 {total|| 0} 个备忘录</p>
    </div>
    <div className="f2">
        <Link to={`/AddList`}>
            <img src={require('../../images/add.png')}/>
        </Link>
    </div>
</div>

export {
    Select
}
export default Index;