import React, { useState, useEffect } from "react";
import axios from 'axios';
import logo from '../../../img/logo.png'
import '../../../css/Report.css'
import { withRouter } from 'react-router-dom';

function Report(props){
    const [vision, setVision] = useState([]);
    const [voice, setVoice] = useState([]);
    const [word, setWord] = useState([]);
    
    const gv_score = () => {
        let vision_score, total_score;
        let voice_score = parseInt(voice['score']);
        let word_score = parseInt(word['score']);
        if (vision["score"] < 0) {
            vision_score = 0;
        } else if (vision["score"] > 100) {
            vision_score = 100;
        } else {
            vision_score = vision["score"];
        }
        total_score = vision_score * 0.4 + voice_score * 0.4 + word_score * 0.2;
        return (<>
                    <div className='totalscore'>총점 : {total_score.toFixed(2)}점</div>
                        <div className='subscore'>
                            <span id='vision'>태도 : {vision_score}점</span>
                            <span id='voice'>목소리 : {voice_score}점</span>
                            <span id='contents'>내용 : {word_score}점</span></div></>);
    };

    useEffect(() => {
        const date = props.location.state.date;
        const userFrom = props.location.state.userFrom;
        
        axios.get('/api/report/vision', {
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
            console.log(response.data.list);
        });

        axios.get('/api/report/voice', {
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
        });

        axios.get('/api/report/word', {
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
        });
    }, []);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        props.history.push('/list');
    };

    return (
        <div className='report'>
            <div className="simpleNavi">
                <img style={{marginLeft:'2vw'}} src={logo} alt='logo'/>
            </div>
            <div className='body'>
                
                <div className='content'>
                    <div className="question" id="report_question">
                        <h1 className='title'>Report</h1>   
                        <h2>
                            <span className='date' id="report_date">{props.date}</span>
                            <span className='time' id="report_time">{props.time}</span>
                        </h2>
                    </div>
                    <div className='box' id='box1'>
                        <span className='mini-title' style={{zIndex:'1'}}>
                            키워드
                        </span>
                        <div className='wordcloud'>
                            <img className="wcImg" src={'Jasmine_text_wordcloud_keywords.png'} alt='wordcloud'/>
                            <div className='rank'>
                                <ul>
                                    <li>1위: {String(word['top3_keywords']).split(',')[0]}</li>
                                    <li>2위:{String(word['top3_keywords']).split(',')[1]}</li>
                                    <li>3위:{String(word['top3_keywords']).split(',')[2]}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='feedback-content subCmt'>
                            <span>{word['keywords_cmt']}</span>
                        </div>
                    </div>
                    
                    <div className='box' id='box2'>
                        <span className='mini-title' style={{zIndex:'1'}}>
                            필요 없는 단어
                        </span>
                        <div className='wordcloud'>
                            <img className="wcImg" src={'Jasmine_text_wordcloud_stopwords.png'} alt='wordcloud'/>
                            <div className='rank'>
                                <ul>
                                    <li>1위: {String(word['top3_stopwords']).split(',')[0]}</li>
                                    <li>2위:{String(word['top3_stopwords']).split(',')[1]}</li>
                                    <li>3위:{String(word['top3_stopwords']).split(',')[2]}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='feedback-content subCmt'>
                            <span>{word['stopwords_cmt']}</span>
                        </div>
                    </div>
                    <div className='box' id='box9'>
                        <span className='mini-title'>
                            어휘 다양도
                        </span>
                        <div className='feedback-content subCmt'>
                            <span>{word['variety_cmt']}</span>
                        </div>
                    </div>
                    <div className='box' id='box10'>
                        <span className='mini-title'>
                            발표 태도
                        </span>
                        <div className='feedback-content subCmt'>
                            <span>{vision['comment']}</span>
                        </div>
                    </div>
                    <div className='box' id='box3'>
                        <span className='mini-title'>
                            많이 사용한 단어
                        </span>
                        <div className='wordcloud'>
                            <img className="wcImg" id="box3img" src={'Jasmine_text_wordcloud_countwords.png'} alt='wordcloud'/>
                            <div className='rank box3img'>
                                <ul id="rank-box3">
                                    <li>1위: {String(word['top3_countwords']).split(',')[0]}</li>
                                    <li>2위:{String(word['top3_countwords']).split(',')[1]}</li>
                                    <li>3위:{String(word['top3_countwords']).split(',')[2]}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='feedback-content subCmt'>
                            <span>{word['countwords_cmt']}</span>
                        </div>
                    </div>
                    <div className='box' id='box4'>
                        <span className='mini-title'>
                            문장 사용
                        </span>
                        <div className='wordcloud'>
                            <img className="scImg" src={'Jasmine_text_sentcount.png'} alt='wordcloud'/>
                        </div>
                        <div className='feedback-content subCmt'>
                            <span>{word['sentcount_cmt']}</span>
                        </div>
                    </div>
                    <div className='box' id='box5'>
                        <span className='mini-title'>
                            발화와 묵음 구간
                        </span>
                        <div className='wordcloud'>
                            <img className="scImg" src={'Jasmine_voice_slienttime.png'} alt='wordcloud'/>
                        </div>
                    </div>
                    
                    <div className='box' id='box6'>
                        <span className='mini-title' style={{visibility:'hidden'}} >
                            발화와 묵음구간2
                        </span>
                        <div className='wordcloud'>
                            <img className="scImg" src={'Jasmine_voice_speaktime.png'} alt='wordcloud'/>
                        </div>
                    </div>
                    <div className='feedback-content subCmt'>
                        <span>{voice['slient_cmt']}</span>
                    </div>
                    <div className='box' id='box7'>
                        <span className='mini-title'>
                            발화 속도
                        </span>
                        <div className='wordcloud'>
                            <img className="scImg" src={'Jasmine_voice_speed.png'} alt='wordcloud'/>
                        </div>
                        <div className='feedback-content subCmt'>
                            <span>{voice['tempo_cmt']}</span>
                        </div>
                    </div>
                    <div className='box' id='box8'>
                        <span className='mini-title'>
                            발화 크기
                        </span>
                        <div className='wordcloud'>
                            <img className="scImg" src={'Jasmine_voice_volume.png'} alt='wordcloud'/>
                        </div>
                        <div className='feedback-content subCmt'>
                            <span>{voice['volume_cmt']}</span>
                        </div>
                    </div>
                    <div className='scoreboard'>
                    {gv_score()}
                    </div>
                    <div className="stopButton" id="back">
                        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                            <button type="submit">뒤로 가기</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Report);