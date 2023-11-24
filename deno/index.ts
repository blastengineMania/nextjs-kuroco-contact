import { BlastEngine, Mail } from "npm:blastengine@2.3.1";
import "https://deno.land/std@0.191.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.155.0/http/server.ts";

new BlastEngine(Deno.env.get("BLASTENGINE_USER_ID"), Deno.env.get("BLASTENGINE_API_KEY")!);

const fromName = Deno.env.get("FROM_NAME") || "管理者";
const fromAddress = Deno.env.get("FROM_ADDRESS") || "";

type RequestParams = {
	company: string;
	email: string;
	message: string;
	name: string;
	type: string;
};

serve(async (req: Request) => {
	const headers = new Response().headers;
	headers.set("Access-Control-Allow-Headers", "*");
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Methods", "*");
	if (req.method.toUpperCase() === "OPTIONS") {
		return new Response(null, { headers });
	}
	const json = await req.json() as RequestParams;
	const mail = new Mail();
	const text = `__name__様
	お問い合わせいただきありがとうございます。内容を確認し、追ってご連絡いたします。

	会社名：
	__company__
	お名前：
	__name__
	お問い合わせ内容：
	__message__
	`;
	mail
		.setFrom(fromAddress, fromName)
		.setSubject('お問い合わせありがとうございます')
		.addCc('atsushi@moongift.co.jp')
		.setText(text)
		.addTo(json.email, json)
		.setEncode('UTF-8');
	await mail.send();
	return new Response(JSON.stringify({
		delivery_id: mail.deliveryId || ""
	}), { headers });
});
