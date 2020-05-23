// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager =wx.getBackgroundAudioManager()
let currentSec = -1  //当前的秒数
let duration = 0  //当前歌曲总时长

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
     showTime:{
       currentTime:'00:00',
       totalTime:'00:00'
     },
     movableDis:0
  },
  lifetimes:{
     ready(){
      this._getMovableDis()
      this._bindBGMEvent()
     }
  }, 
  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableDis(){
      const query =this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        movableAreaWidth =rect[0].width
        movableViewWidth =rect[1].width
        console.log(movableAreaWidth,movableViewWidth)
      })
    },
    _bindBGMEvent(){
      backgroundAudioManager.onStop(()=>{
        console.log('onStop')
      })
      backgroundAudioManager.onPause(()=>{
        console.log('onStop')
      })
      backgroundAudioManager.onWaiting(()=>{
        console.log('onStop')
      })
      backgroundAudioManager.onCanplay(()=>{
        console.log('onStop')
      })
      backgroundAudioManager.onTimeUpdate(()=>{
        const currentTime =backgroundAudioManager.currentTime
        const duration = backgroundAudioManager.duration
       
        if(currentTime.toString().split('.')[0] != currentSec){
          const currentTimeFmt = this._dateFormat(currentTime)
          this.setData({
            movableDis:(movableAreaWidth-movableViewWidth)*currentTime/duration,
            progress:currentTime/duration*100,
            ['showTime.currentTime'] :`${currentTimeFmt.min}:${currentTimeFmt.sec}`
          })
          console.log(currentSec)
          currentSec = currentTime.toString().split('.')[0]
        }

       
      })
      backgroundAudioManager.onCanplay(()=>{
        console.log('onCanplay')
        if(typeof backgroundAudioManager.duration !='undefined'){
          this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
      })
    },
    _setTime(){
      duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    _dateFormat(sec){
       const min =Math.floor(sec/60)
       sec =Math.floor(sec%60)
       return {
         'min':this._parse0(min),
         'sec':this._parse0(sec)
       } 
    },
    //补零
    _parse0(sec){
      return sec <10 ? '0'+sec:sec
    },
    onChange(event){
       if(event.detail.source =='touch'){
         this.data.progress = event.detail.x/(movableAreaWidth-movableViewWidth)*100
         this.data.movableDis = event.detail.x
       }
    },
    onTouchEnd(){
       const currentTimeFmt =this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
       this.setData({
         progress:this.data.progress,
         movableDis:this.data.movableDis,
         ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
       })
       backgroundAudioManager.seek(duration*this.data.progress/100)  
    }
  }
})
