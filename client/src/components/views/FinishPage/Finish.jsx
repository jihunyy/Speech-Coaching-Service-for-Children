import React, { useState, useEffect } from "react";
import axios from 'axios';
import logo from '../../../img/logo.png'
import '../../../css/Report.css'
import miniFlower from '../../../img/mini_flower.png';
import txtBsImg from '../../../img/bear.png';
import { withRouter } from 'react-router-dom';

function Finish(props){
    const [vision, setVision] = useState([]);
    const [voice, setVoice] = useState([]);
    const [word, setWord] = useState([]);
    const [flower, setFlower] = useState(0);
    const [flowers, setFlowers] = useState([]);
    let isUpdate = false;

    let total_comment = "참 잘했어요! 오늘처럼 발표해주세요.";

    /*const get_flowers = () => {
        axios.get('/api/report/user', {
            params: {
                userFrom: userFrom
            }
        }).then((response) => {
            if (response.data.success) {
            } else {
                alert('사용자 정보를 불러오는 데 실패했습니다.');
            }
            setFlower((preFlower) => preFlower + response.data.user["flower"]);
        })
    }*/
    
    function mk_flowers(vision_score, voice_score, word_score) {
        let flower_cnt = 0;
        let flower_arr = [];

        if (vision_score < 0) {
            vision_score = 0;
        } else if (vision_score > 100) {
            vision_score = 100;
        }

        const total_score = vision_score * 0.4 + voice_score * 0.4 + word_score * 0.2;
        if (total_score >= 80) {
            flower_cnt = 5;
        } else if (total_score >= 50) {
            flower_cnt = 4;
        } else {
            flower_cnt = 3;
        }
        if(!isUpdate){
            setFlower((preFlower) => preFlower + flower_cnt);
            isUpdate = true;
        }

        for (let i = 0; i < flower_cnt; i++) {
            flower_arr.push(<img key={i} src={miniFlower} alt='flowerrate'/>);
        }
        setFlowers(flower_arr);
        console.log(vision_score, voice_score, word_score, total_score, flower_cnt);
        return flower_arr;
    }

    const mk_comments = () => {
        let comments = [];
        if (vision['score'] >= 70) {
            comments.push(<><span key='vision1'>우와~ 오늘 정말 발표태도가 좋아요!<br/>눈과 고개를 앞으로 향해서 잘 발표했어요.</span><br/></>)
        } else {
            comments.push(<><span key='vision2'>발표하는 모습이 멋있어요!<br/>다음에는 앞을 많이 쳐다보면 더욱 좋을 것 같아요.</span><br/></>)
        }
        comments.push(<br/>);
        let comment_arr = ['keywords_cmt_c','stopwords_cmt_c','countwords_cmt_c']
        comment_arr.forEach( (txt,idx)=>{
            const tmp = word[txt]
            comments.push(<><span key={idx+'w'}>{tmp}</span><br/></>)
        });
        comments.push(<br/>);
        comment_arr = ['slient_cmt_c','tempo_cmt_c','volume_cmt_c']
        comment_arr.forEach( (txt,idx)=>{
            const tmp = voice[txt]
            comments.push(<><span key={idx+'v'}>{tmp}</span><br/></>)
        })
        return comments;
    };

    useEffect(async () => {
        const date = props.location.state.date;
        const userFrom = props.location.state.userFrom;
        let vision_score = 0;
        let voice_score = 0;
        let word_score = 0;

        await axios.get('/api/report/vision', {
            params: {
                userFrom: userFrom,
                timestamp: date
            },
        }).then((response) => {
            if (response.data.success) {
            } else {
                alert('발표 태도 분석을 불러오는 데 실패했습니다.');
            }
            setVision(response.data.list);
            vision_score = response.data.list["score"];
            console.log(vision_score)
        });

        await axios.get('/api/report/voice', {
            params: {
                userFrom: userFrom,
                timestamp: date
            },
        }).then((response) => {
            if (response.data.success) {
            } else {
                alert('발표 음성 분석을 불러오는 데 실패했습니다.');
            }
            setVoice(response.data.list);
            voice_score = response.data.list["score"];
            console.log(voice_score)
        });

        await axios.get('/api/report/word', {
            params: {
                userFrom: userFrom,
                timestamp: date
            },
        }).then((response) => {
            if (response.data.success) {
            } else {
                alert('발표 대본 분석을 불러오는 데 실패했습니다.');
            }
            setWord(response.data.list);
            word_score = response.data.list["score"];
            console.log(word_score)
        });

        // get_flowers();
        console.log(vision_score, voice_score, word_score);
        await mk_flowers(vision_score, voice_score, word_score);
    }, []);

    const post_flowers = () => {
        axios.put('/api/report/flower', {
            userFrom: props.location.state.userFrom,
            flower: flower
        }).then((response) => {
            if (response.data.success) {
                console.log(response.data.user);
                props.history.push('/home');
            } else {
                alert('자스민 개수를 업데이트하는 데 실패했습니다.');
            }
        })
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        
        post_flowers();
    };

    return (
        <div className='report'>
            <div className="simpleNavi">
                <img key='logo' style={{paddingLeft:'2vw'}}src={logo} alt='logo'/>
            </div>
            <div className='body'>
                <div className='content' id="finish_ctn">
                    <div className="question" id="report_question">
                        <h1 className='title'>오늘도 수고했어요~</h1>
                    </div>
                    <div className='finish-box'>
                        <span className='finish-span'>
                            {total_comment}
                        </span>
                        <div className='flower-rate'>
                            {flowers}
                        </div>
                    </div>
                    <div className='thirdrow third-finish'>
                        <span className='finish-span' id='feedback-title'><img src={txtBsImg} />자스민이 하고싶은 말</span>
                        <div className='feedback-content finish-feedback-content' id="finish-fb">
                            {mk_comments()}
                        </div>
                    </div>
                    
                    <div className="stopButton" id="back">
                        <form key='form' style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                            <button type="submit">끝내기</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Finish);