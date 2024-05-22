# HOW TO RECONCILE DIFFERING GIT BRANCHES IN LOCAL MACHINE AND REMOTE BECAUSE I RENAMED MICHELLE'S BRANCH TO DEV
(it may or may not work, sorry)

```  
git branch -m michelle/signup_login_home_and_forms dev
git fetch origin
git branch -u origin/dev dev
git remote set-head origin -a
```
  
