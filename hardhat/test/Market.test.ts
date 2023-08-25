import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

// 共通のセットアップ処理をFixture にまとめる
async function deploySPTMarketFixture() {  // async なので関数の結果はpromise
    
    const [account1, account2, account3] = await ethers.getSigners();
    
    const Market = await ethers.getContractFactory("SPTMarket");
    const market= await Market.deploy(); // Contract object, 
    const tx = await market.deploymentTransaction();
    await tx?.wait();
    // console.log("Deployed to: ", await market.getAddress());
    
    return { market, account1, account2, account3 };
}

async function main() {
    // 帰り値がオブジェクトの場合、プロパティ名は一致している必要がある。
    // こんな感じで  // const { account1, account2, account3 } = await loadFixture(deployMessageBoardFixture);
    
    
    describe("CreateSPT", function() {

        it("successfully executed and emit event", async function () {

            const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);

            const publisher = account1;
            const tokenURI = "http://sampleurl.co.jp";
            const prompt = "This is a test prompt";
            const params = "Test Params";
            const description = "Test description";
            const model = "gpt3.5-turbo";
            const price = ethers.parseUnits("1");

            const tx = await market.connect(publisher).createSPT(
                tokenURI,
                prompt,
                params,
                description,
                model,
                price
            );
            const receipt = await tx.wait();

            expect(receipt?.from).to.equal(await publisher.getAddress());
            expect(receipt?.to).to.equal(await  market.getAddress());
            
            // event が正しく発火されているかを確認
            const args = receipt?.logs[0].args;
            expect(args.id).to.equal(0);
            expect(args.tokenURI).to.equal(tokenURI);
            expect(args.prompt).to.equal(prompt);
            expect(args.description).to.equal(description);
            expect(args.model).to.eq(model);
            expect(args.price).to.eq(price);

            const info = await market.getSPTInfo(0);
            // console.log(info);
        });

        describe("updateSPT", function () {
            it("reverted with onlyPublisher properly", async function () {
                const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);

                // まず出品
                const publisher = account1;
                const tokenURI = "http://sampleurl.co.jp";
                const prompt = "This is a test prompt";
                const params = "Test Params";
                const description = "Test description";
                const model = "gpt3.5-turbo";
                const price = ethers.parseUnits("1");
    
                const tx1 = await market.connect(publisher).createSPT(
                    tokenURI,
                    prompt,
                    params,
                    description,
                    model,
                    price
                );
                await tx1.wait();

                // 
                const id = 0;
                const new_prompt = "New Prompt";
                const new_params = "New params";
                const new_description = "New Description";
                const new_model = "gpt4";
                const new_price = ethers.parseUnits("11");
                const tx2 = market.connect(account2).updateSPT( // to.be.revertedWith を使う時は Promise のまま
                    id,
                    tokenURI,
                    new_prompt,
                    new_params,
                    new_description,
                    new_model,
                    new_price,
                    false
                );

                await expect(tx2).to.be.revertedWith(
                    'onlyPublisher: Only publisher can access to this method'
                );

            });
            it("Not reverted if publisher call updateSPT()", async function () {
                const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);

                // まず出品
                const publisher = account1;
                const tokenURI = "http://sampleurl.co.jp";
                const prompt = "This is a test prompt";
                const params = "Test Params";
                const description = "Test description";
                const model = "gpt3.5-turbo";
                const price = ethers.parseUnits("1");
    
                const tx1 = await market.connect(publisher).createSPT(
                    tokenURI,
                    prompt,
                    params,
                    description,
                    model,
                    price
                );
                await tx1.wait();

                // 
                const id = 0;
                const new_prompt = "New Prompt";
                const new_params = "New Params";
                const new_description = "New Description";
                const new_model = "gpt4";
                const new_price = ethers.parseUnits("11");
                const tx2 = await  market.connect(publisher).updateSPT( // to.be.revertedWith を使う時は Promise のまま
                    id,
                    tokenURI,
                    new_prompt,
                    new_params,
                    new_description,
                    new_model,
                    new_price,
                    false
                );
                const receipt = await tx2.wait();

                // event が正しく発火されているかを確認
                const args = receipt?.logs[0].args;
                expect(args.id).to.equal(0);
                expect(args.tokenURI).to.equal(tokenURI);
                expect(args.prompt).to.equal(new_prompt);
                expect(args.params).to.eq(new_params);
                expect(args.description).to.equal(new_description);
                expect(args.model).to.eq(new_model);
                expect(args.price).to.eq(new_price);

            });
        });
    });

    describe("buySPT", function () {
        it("successfully bought", async function () {
            const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);

            // まず出品する
            const publisher = account1;
            const buyer = account2;
            const tokenURI = "http://sampleurl.co.jp";
            const prompt = "This is a test prompt for item1";
            const params = "Test Params";
            const description = "Description for item1";
            const model = "gpt3.5-turbo";
            const price = ethers.parseUnits("1");

            const tx1 = await market.connect(publisher).createSPT(
                tokenURI,
                prompt,
                params,
                description,
                model,
                price
            );
            await tx1.wait();


            // 購入する
            const tx2 = await market.connect(buyer).buySPT(0, { value: price});
            await tx2.wait();
            const [retrievedPrompt, retrievedParams] = await market.connect(buyer).showPromptParams(0);
            expect(retrievedPrompt).to.eq(prompt);
            expect(retrievedParams).to.eq(params);
        });

        describe("showPrompt", function () {
            it("reverted with onlyOwners properly", async function () {
                const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);

                // まず出品
                const publisher = account1;
                const tokenURI = "http://sampleurl.co.jp";
                const prompt = "This is a test prompt";
                const params = "Test Params";
                const description = "Test description";
                const model = "gpt3.5-turbo";
                const price = ethers.parseUnits("1");
    
                const tx1 = await market.connect(publisher).createSPT(
                    tokenURI,
                    prompt,
                    params,
                    description,
                    model,
                    price
                );
                await tx1.wait();

                const id = 0;
                const tx2 =  market.connect(account3).showPromptParams(id);
                await expect(tx2).to.be.revertedWith(
                    "onlyOwners: Only owners can access to this method"
                );
            });

            it("Not reverted if owner call showPrompt()", async function () {
                const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);

                // まず出品
                const publisher = account1;
                const buyer = account2;

                const tokenURI = "http://sampleurl.co.jp";
                const prompt = "This is a test prompt";
                const params = "Test Params";
                const description = "Test description";
                const model = "gpt3.5-turbo";
                const price = ethers.parseUnits("1");
    
                const tx1 = await market.connect(publisher).createSPT(
                    tokenURI,
                    prompt,
                    params,
                    description,
                    model,
                    price
                );
                await tx1.wait();

                const id = 0;

                const tx2 = await market.connect(buyer).buySPT(id, { value: price} );
                await tx2.wait();

                const [returned_prompt, returned_params] = await market.connect(buyer).showPromptParams(id);
                expect(returned_prompt).to.eq(prompt);
                expect(returned_params).to.eq(params);
            });
        });
    });

    describe("withDrawFunds", function () {
        it("successfully withdrawn - 10% commission fee ", async function() {
            // createSPT -> buySPT -> withDrawFunds
            
            const { market,  account1, account2, account3 } = await loadFixture(deploySPTMarketFixture);
            const deployer = account1;
            const publisher = account2;
            const buyer = account3;

            // 1. createSPT
            const tokenURI = "http://sampleurl.co.jp";
            const prompt = "This is a test prompt";
            const params = "Test Params"
            const description = "Test description";
            const model = "gpt3.5-turbo";
            const price = ethers.parseUnits("1");

            const tx1 = await market.connect(publisher).createSPT(
                tokenURI,
                prompt,
                params,
                description,
                model,
                price
            );
            await tx1.wait();

            // 2. buySPT
            const tx2 = await market.connect(buyer).buySPT(0, { value: price});
            await tx2.wait();

            const funds = await market.connect(deployer).checkFunds();
            // console.log("funds:", funds);
            // console.log("price:", price);
            expect(price).to.eq(funds* 10n);
            // withdraw
            await market.connect(deployer).withdrawFunds();

            const next_funds = await market.connect(deployer).checkFunds();
            
            expect(next_funds).to.eq(0);

            // console.log(await market.getNumItems());


        })
    })
    
    
}
main().catch(console.error);


