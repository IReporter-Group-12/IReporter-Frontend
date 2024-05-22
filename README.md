# HOW TO RECONCILE DIFFERING GIT BRANCHES IN LOCAL MACHINE AND REMOTE BECAUSE I RENAMED MICHELLE'S BRANCH TO DEV
(it may or may not work, sorry)

1. First, switch to the main branch

    `git switch main`

2. Next, delete all the branches in your local machine that have had their upstream deleted (after stashing your changes).
You can find out which branches exactly by running:

    `git branch -vv`

    This command shows all local branches along with their tracking information. Look for branches that have `[origin/branch-name: gone]` in their status, indicating that the remote branch has been deleted.

    To delete these branches use:

    `git branch -D <branch-name>`

3. Now to fetch the latest dev branch, run:

    `git switch dev`

    This should work.

4. If it doesn't work, or you are wary of deleting things indiscriminately, try this command sequence from Github to update the dev branch in your machine:

    ```  
    git branch -m michelle/signup_login_home_and_forms dev
    git fetch origin
    git branch -u origin/dev dev
    git remote set-head origin -a
    ```
I hope it works don't crucify me please :)