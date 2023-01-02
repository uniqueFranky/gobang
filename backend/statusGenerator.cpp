#include <cstdio>
#include <algorithm>
#include <cstring>
using namespace std;

int main() {
    freopen("level.txt", "w", stdout);
    for(int i1 = 0; i1 < 3; i1++) {
        for(int i2 = 0; i2 < 3; i2++) {
            for(int i3 = 0; i3 < 3; i3++) {
                for(int i4 = 0; i4 < 3; i4++) {
                    for(int i5 = 0; i5 < 3; i5++) {
                        for(int i6 = 0; i6 < 3; i6++) {
                            printf("level[%d][%d][%d][%d][%d][%d] = \n", i1, i2, i3, i4, i5, i6);
                        }
                    }
                }
            }
        }
    }
}