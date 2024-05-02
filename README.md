# cse312project
#PROJECT TITLE
#PROJECT DESCRIPTION
#FEATURES
#INSTALLATION
#DEPENDENCIES
#AUTHORS

###Objective 1/3 test cases
1. Open 3 browser (2 normal tab and 1 incognito) for simplicity tab1, tab2, tab3 = p1, p2, p3
2. Sign up and log in, Navigate to battle page by click on battle button on top right
3. p1 and p2 click on battle button
    3a. Ensure all tabs can see p1 and p2 battle request
    3b. p1 can not see p1's battle request button (or vice vera for p2)
4. p1 click on p2 battle request (or vice versa)
    4a. use p3 to see that p1 battle request is gone (if p1 click on p2 or vice versa) 
    4b. p3 see p1 and p2 battle on going request
5. p1 click on attack p2 do not (or vice versa)
    5a. wait 60 second and ensure message say p1 win b/c p2 fail to make  move
    5b. repeat for p2 
    5c. repeat for both p1 and p2 not pressing any button
6. Restart another battle
    6 a. in p1 control-f (id="p1_attack_button" onclick="attack('p1')") change onclick="attack('p1')" to onclick="attack('p2')" and click attack
    6b. Ensure that message said p1modifiy value p2 win 
    6c. repeat for defend button id="p1_defend_button" onclick="defend('p1')" to onclick="defend('p2')
    6d. Repeat 6a-6c for p2
7. Restart another battle
    7a. Ensure all values are there (p1info and p2info)
8. Restart another battle
    8a. ensure that p1 win and ensure that result is corrent
    8b.repeat for p2 
9. Go back to home
    9a. ensure that leaderboard is correct 
10. when battle is done ensure that its gone from the battle list
11. Restart another battle
    8a. use p1 press forfeit button, Ensure result is correct
    8b. repeat for p2 