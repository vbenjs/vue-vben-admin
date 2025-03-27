import { onMounted, ref } from 'vue';

export interface TTSOptions {
  lang?: string;
  volume?: number;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
}

export function useTTS(options?: TTSOptions) {
  const voices = ref<SpeechSynthesisVoice[]>([]);

  // 语音播报
  const speakVoice = (msg: any) => {
    window.speechSynthesis.cancel();
    try {
      initVoices().then(() => {
        // 实例化播报内容
        const instance = new SpeechSynthesisUtterance();
        instance.text = msg; // 文字内容: 测试内容
        instance.lang = options?.lang || 'zh-CN'; // 使用的语言:中文
        instance.volume = options?.volume || 1; // 声音音量：1
        instance.rate = options?.rate || 1; // 语速：1
        instance.pitch = options?.pitch || 1; // 音高：1
        // instance.voice = null; // 某人的声音
        // let voices = window.speechSynthesis.getVoices();
        instance.voice = voices.value.find((voice) => {
          return voice.localService === true && voice.lang === 'zh-CN';
        }) as SpeechSynthesisVoice;
        // instance.voice = window.speechSynthesis.getVoices()[0];//选中第一个语音包
        instance.addEventListener('end', () => {
          options?.onEnd?.();
        }); // 监听播报完成状态，播完可以做些其它处理
        window.speechSynthesis.speak(instance);
      });
    } catch (error) {
      console.error('语音播报失败', error);
    }
  };

  // 初始化语音列表
  async function initVoices() {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis is not supported in this browser.');
      return;
    }

    // 获取当前的声音列表
    voices.value = window.speechSynthesis.getVoices();

    // 监听语音变化 Chrome允许使用远程服务器进行语音合成，而SpeechSynthesis向谷歌服务器请求语音列表。要解决此问题，您需要等待语音将被加载，然后再次请求它们。
    speechSynthesis.onvoiceschanged = () => {
      voices.value = window.speechSynthesis.getVoices();
    };

    // 等待语音列表加载完成
    await new Promise<void>((resolve) => {
      if (voices.value.length > 0) {
        resolve();
      } else {
        const intervalId = setInterval(() => {
          const newVoices = window.speechSynthesis.getVoices();
          if (newVoices.length > 0) {
            voices.value = newVoices;
            clearInterval(intervalId);
            resolve();
          }
        }, 1000);
      }
    });
  }
  // 语音暂停
  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
  };

  onMounted(() => {
    // 初始化
    initVoices();
  });

  return {
    speakVoice,
    cancelSpeech,
  };
}
