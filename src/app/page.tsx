import { Connect } from "../components/Connect";
import { Connected } from "../components/Connected";
import { SendTransaction } from "../components/SendTransaction";

export default function Page() {
  return (
    <div>
      <h1>wagmi + Next.js</h1>
      <Connect />
      <Connected>
        <SendTransaction />
      </Connected>
    </div>
  );
}
