#include<iostream>
using namespace std;

int findMissingNumber(int *arr, int n){
	int res;
	for(int i=0;i<n-1;i++){
		res = arr[i] + 1;
		if(arr[i+1] != res){
			return res;
		}
	}
	return -1;
}

int main()
{
	int arr[] = {11, 12, 13, 14, 16, 17, 18, 19, 20};
	int n = sizeof(arr)/sizeof(arr[0]);
	cout<< findMissingNumber(arr, n);
	return 0;
}