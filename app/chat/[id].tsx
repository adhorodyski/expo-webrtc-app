import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import { GiftedChat } from "react-native-gifted-chat";
import { socket } from "../../lib/socket";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const Page = () => {
  const { id } = useLocalSearchParams();

  const peerRef = useRef(new RTCPeerConnection(servers));
  const sendChannel = useRef<RTCDataChannel>();
  const otherUser = useRef();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.emit("join-room", id);

    socket.on("other-user", (userId) => {
      otherUser.current = userId;
      sendChannel.current = peerRef.current.createDataChannel(
        "sendChannel"
      ) as any;
      sendChannel.current.onmessage = handleReceiveMessage;
    });

    socket.on("user-joined", (userId) => {
      otherUser.current = userId;
    });

    socket.on("offer", async (e) => {
      const desc = new RTCSessionDescription(e.sdp);

      await peerRef.current.setRemoteDescription(desc);
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      socket.emit("answer", {
        target: otherUser.current,
        caller: socket.id,
        sdp: peerRef.current.localDescription,
      });
    });

    socket.on("answer", async (e) => {
      const desc = new RTCSessionDescription(e.sdp);
      await peerRef.current.setRemoteDescription(desc);
    });

    socket.on("ice-candidate", async (e) => {
      if (!peerRef.current) return;

      const candidate = new RTCIceCandidate(e);
      await peerRef.current.addIceCandidate(candidate);
    });

    peerRef.current.onicecandidate = (e: any) => {
      if (!e?.candidate) return;

      socket.emit("ice-candidate", {
        target: otherUser.current,
        candidate: e.candidate,
      });
    };

    peerRef.current.ondatachannel = (event: any) => {
      sendChannel.current = event.channel;
      sendChannel.current.onmessage = handleReceiveMessage;
      console.log("[SUCCESS] Connection established");
    };

    peerRef.current.onnegotiationneeded = async () => {
      const offer = await peerRef.current.createOffer({});
      await peerRef.current.setLocalDescription(offer);

      socket.emit("offer", {
        target: otherUser.current,
        caller: socket.id,
        sdp: peerRef.current.localDescription,
      });
    };

    return () => {
      socket.off("other-user");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.disconnect();
    };
  }, []);

  const handleReceiveMessage = (e: any) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [
        {
          _id: Math.floor(Math.random() * 10_000).toString(),
          text: e.data,
          createdAt: new Date(),
          user: {
            _id: 2,
          },
        },
      ])
    );
  };

  const sendMessage = useCallback((messages = []) => {
    // Prevent local-only messages from appearing on the UI
    if (!sendChannel.current || messages.length <= 0) {
      return;
    }

    // Send message to other user over a send channel
    sendChannel.current.send(messages[0].text);

    // Set local messages
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: id.toString() }} />

      <SafeAreaView style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={sendMessage}
          user={{
            _id: 1,
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default Page;
