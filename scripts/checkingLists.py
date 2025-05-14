# list1 = "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any give day most us person should thing need many very still find here life child world may between write down school feel might try since mean something leave old never become right around three man small place same high different kind help ask through much before line own too follow big air each word tell play part put read group every next white number such why start last important run house show hear under really call while move end where woman week again learn point company city night live game without let program hope form off hand system home problem question head understand black government friend little believe keep state begin against country great seem stand turn morning mother father paper often together side young area today serve able job always meet consider money book water family few story business second though car set love example case eye stop true fact month must open room nothing remember better food boy buy music idea body happen hold once hour walk strong reason public name change power pay study bring minute girl far hard soon free add during light build stay listen long agree student teacher real less enough watch speak receive send plan lead issue member level include almost allow already health early sure course pull continue doctor offer deal join office away past close along law low late inside class maybe field research grow reach information voice cut ready mind care ever rather party rate near street drop quite front matter human answer lose drive heart sign experience easy center fall process market else decide certain door present personal control full color court share short test wait carry clear return arm age national development whole figure interest support sense phone education policy visit including report produce ground approach value quickly several language record community social team simple natural war death size break history special third final computer across cause red station moment piece until dark major although top foot letter outside practice sometimes act order wish role either cold happy check cost especial quality chance whether common forward rule action result notice tree rest attention amount position trade view sit above success among toward hot probably service list effort situation fire wide tax summer create provide term win within recent sea suggest opportunity self dog cat fun tall data future key product bad earth beauty north south space travel thought fight memory choice green blue photograph"
# list2 = "board project note scene remain argue wear cup dinner afraid born serious single bill pass wonder floor imagine table land wall industry machine island road bank charge farm match event various model per race hotel capital material star deep edge individual specific difficult medical current sister blood pattern staff shape unit base property determine likely degree foreign range occur bed manner stage glass plane solution method stone slow scale heavy bag heat marriage surface purpose supply function hall damage remove reserve claim royal winter exercise clothes total thin disease equipment basis application popular direct population private kitchen factor series television skill adult shot weather affect perform loan science peace sound benefit responsible oil card text audience object religion rock injury shop camp decade message movie spring positive forest film speed trip physical warm district negative reference strategy income challenge enemy demand male tower patient map horse lake opinion dream fail agent attack operation search respect drink worth neck hair topic army camera account block style sell correct culture path attorney reality code mountain employee transfer investment device conversation ball contract prime occasion official flight expert session empty average beyond feature sample involve digital club ship image tradition truth zone soil hole troop represent describe commit volume nation engine ticket vehicle territory flow character version status resident impact faith gas grant exist element define train golden plate task prison survey pound site spot band fear route sector circle belt fat location studio prevent partner drug master save complex division career estate pain weapon relative cloud protect discover row fuel valley climb metal waste angry advantage revenue bottle profit store animal instrument guard shoe expand chief grade enable football active attitude adopt release link document budget reform upset tour limit client soldier chairman obtain coast moon double stress connect bone pack target identity combine title baby broad square coal welcome refer signal sand distance file wine gain decline storm bridge gift branch relief resolution bar egg victory lip software speech chicken edit bird nurse grass wild observe pocket birthday furniture box radio entire package nose expression tool wave conduct screen gene sky journey curve folk sugar panel poet grand poll dance engage busy copy hero painting dollar pilot novel tea universe traffic slide agency phenomenon smile beach wood spirit fish corner honey sentence shoulder smoke factory bat drama chest entrance fruit theme count vegetable climate poem stick tiny index frame ordinary rapid bomb quarter shadow youth accident murder iron potato shift tank throat hat tired salt alive gate judge wing brain bear meat tail cover apartment wound silence pure moral thick deputy sight touch unique ceremony vast border champion drum theater guitar hide crop knife mistake coach uniform bloody leaf cream construction gray bitter succeed jump stomach actor jacket cotton bread charity bell equal debate twin passion pitch remote episode smell super surprise wrap seed intelligence alcohol treasure trick joint lean proud giant doubt crash neighbor shower print laboratory plastic trail platform switch protest planet fence pipe stuff mount angle copper dozen"
# list1 = list1.split()
# list2 = list2.split()
# list3 = []
# list4 = []
# # print(len(list2))
# for word in list2:
#     if word in list3:
#         list4.append(word)
#     else:
#         list3.append(word)

# print(list4)
# print(len(list2))
# # print(len(list4))
# # list3 = list3[:500]
# print(len(list3))
# common_words = set(list1).intersection(set(list3))
# list5 = []
# for word in list3:
#     if word not in common_words:
#         list5.append(word)
# print(len(list5))
# print(list5)
# list5 = " ".join(list5)
# # print(len(common_words))
# # print(common_words)
# # print(list2[499])
# # print(len(list1))
# # print(len(list2))
# # list2 = " ".join(list2)
# print(list5)
list6 = input()
list6 = list6.split()
counter = 0
for ward in list6:
    print(ward)
    counter += 1
    if counter % 10 == 0:
        print("----------")